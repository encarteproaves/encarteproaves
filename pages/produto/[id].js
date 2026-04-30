import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProdutoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cliente, setCliente] = useState({});
  const [fretes, setFretes] = useState([]);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [freteSelecionado, setFreteSelecionado] = useState(null);

  // 🔥 NOVOS STATES CEP
  const [cepErro, setCepErro] = useState(false);
  const [cepValido, setCepValido] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProduto() {
      try {
        const res = await fetch(`/api/produto?id=${id}`);
        const data = await res.json();
        setProduto(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduto();
  }, [id]);

  function handleChange(campo, valor) {
    setCliente((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  // 🔥 FORMATA CEP
  function formatarCEP(valor) {
    const cep = valor.replace(/\D/g, "").slice(0, 8);
    if (cep.length <= 5) return cep;
    return cep.replace(/(\d{5})(\d+)/, "$1-$2");
  }

  // 🔥 BUSCAR CEP COM VALIDAÇÃO VISUAL
  async function buscarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setCepErro(false);
      setCepValido(false);
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        setCepErro(true);
        setCepValido(false);

        setCliente((prev) => ({
          ...prev,
          endereco: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));

        return;
      }

      setCepErro(false);
      setCepValido(true);

      setCliente((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));

    } catch (err) {
      console.error("Erro CEP:", err);
      setCepErro(true);
      setCepValido(false);
    }
  }

  async function calcularFrete() {
    try {
      setLoadingFrete(true);

      const res = await fetch("/api/frete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cep: cliente.cep,
          produtoId: produto.id,
        }),
      });

      const data = await res.json();

      const lista = data?.options || data || [];

      const filtrados = lista
        .filter((f) => Number(f.price || f.cost || f.valor || 0) > 0)
        .sort(
          (a, b) =>
            Number(a.price || a.cost || a.valor || 0) -
            Number(b.price || b.cost || b.valor || 0)
        );

      setFretes(filtrados);

    } catch (err) {
      console.error("Erro frete:", err);
    } finally {
      setLoadingFrete(false);
    }
  }

  function validarCampos() {
    if (!cliente.nome) return "Digite seu nome";
    if (!cliente.telefone) return "Digite o telefone";
    if (!cliente.cep) return "Digite o CEP";
    if (!cliente.endereco) return "Digite o endereço";
    if (!cliente.numero) return "Digite o número";
    return null;
  }

  async function comprar() {
    const erro = validarCampos();

    if (erro) {
      alert(erro);
      return;
    }

    if (!freteSelecionado) {
      alert("Selecione um frete");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: produto.nome,
          preco: produto.preco,
          frete: freteSelecionado,

          nome_cliente: cliente.nome,
          telefone: cliente.telefone,
          cpf: cliente.cpf,

          cep: cliente.cep,
          endereco: cliente.endereco,
          numero: cliente.numero,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          estado: cliente.estado,

          canto: cliente.canto,
        }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro no pagamento");
      }

    } catch (err) {
      console.error(err);
      alert("Erro no checkout");
    }
  }

  function falarWhatsapp() {
    const mensagem = encodeURIComponent(
      `Olá, tenho interesse no produto ${produto?.nome || ""}`
    );

    window.open(
      `https://api.whatsapp.com/send?phone=5511984309480&text=${mensagem}`
    );
  }

  if (loading) return <p>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  const precoFrete = Number(
    freteSelecionado?.price ||
    freteSelecionado?.cost ||
    freteSelecionado?.valor ||
    0
  );

  const total = Number(produto.preco || 0) + precoFrete;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>

        <div>
          <img src={produto.imagem} style={{ width: 300 }} />
        </div>

        <div style={{ flex: 1 }}>
          <h1>{produto.nome}</h1>

          <h2 style={{ color: "green" }}>
            {Number(produto.preco || 0).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>

          <p>{produto.descricao}</p>

          <p style={{ color: "red" }}>
            Restam {produto.estoque} unidades
          </p>

          <hr />

          {/* CEP */}
          <input
            placeholder="Digite seu CEP"
            style={{
              ...input,
              border: cepErro ? "2px solid red" : "1px solid #ccc"
            }}
            value={cliente.cep || ""}
            onChange={(e) => {
              const formatado = formatarCEP(e.target.value);
              handleChange("cep", formatado);
              buscarCEP(formatado);
            }}
          />

          {cepErro && (
            <p style={{ color: "red", marginTop: -5 }}>
              CEP inválido ou não encontrado
            </p>
          )}

          {cepValido && (
            <p style={{ color: "green", marginTop: -5 }}>
              CEP válido ✔
            </p>
          )}

          <input placeholder="Seu nome" style={input} onChange={(e)=>handleChange("nome", e.target.value)} />
          <input placeholder="Telefone" style={input} onChange={(e)=>handleChange("telefone", e.target.value)} />
          <input placeholder="CPF" style={input} onChange={(e)=>handleChange("cpf", e.target.value)} />

          <input placeholder="Endereço" style={input} value={cliente.endereco || ""} onChange={(e)=>handleChange("endereco", e.target.value)} />
          <input placeholder="Número" style={input} onChange={(e)=>handleChange("numero", e.target.value)} />
          <input placeholder="Bairro" style={input} value={cliente.bairro || ""} onChange={(e)=>handleChange("bairro", e.target.value)} />
          <input placeholder="Cidade" style={input} value={cliente.cidade || ""} onChange={(e)=>handleChange("cidade", e.target.value)} />
          <input placeholder="Estado" style={input} value={cliente.estado || ""} onChange={(e)=>handleChange("estado", e.target.value)} />

          {produto.nome?.toLowerCase().includes("pen drive") && (
            <input
              placeholder="Digite o canto"
              style={input}
              onChange={(e)=>handleChange("canto", e.target.value)}
            />
          )}

          <div style={{ marginTop: 10 }}>
            <button
              style={{
                ...btn,
                opacity: cepValido ? 1 : 0.5,
                cursor: cepValido ? "pointer" : "not-allowed"
              }}
              onClick={calcularFrete}
              disabled={!cepValido}
            >
              Calcular Frete
            </button>

            <button style={btn} onClick={comprar}>
              Compra segura
            </button>
          </div>

          {loadingFrete && <p>Calculando frete...</p>}

          {fretes.map((f, i) => (
            <div key={i}>
              <label>
                <input
                  type="radio"
                  name="frete"
                  onChange={() => setFreteSelecionado(f)}
                />
                {f.name} - {Number(f.price || f.cost || f.valor || 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })} ({f.delivery_time || f.delivery_days || "?"} dias)
              </label>
            </div>
          ))}

          <h3>
            Total: {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>

          <button style={btn} onClick={falarWhatsapp}>
            Falar no WhatsApp
          </button>

        </div>
      </div>
    </div>
  );
}

const input = {
  display: "block",
  width: "100%",
  marginBottom: 8,
  padding: 8,
};

const btn = {
  marginRight: 10,
  padding: 10,
};