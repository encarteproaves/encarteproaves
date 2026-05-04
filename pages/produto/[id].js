import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProdutoPage() {

  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cliente, setCliente] = useState({});
  const [fretes, setFretes] = useState([]);
  const [freteSelecionado, setFreteSelecionado] = useState(null);

  const [loadingFrete, setLoadingFrete] = useState(false);
  const [cepErro, setCepErro] = useState(false);

  // ===============================
  // BUSCAR PRODUTO
  // ===============================
  useEffect(() => {
    if (!id) return;

    async function fetchProduto() {
      try {
        const res = await fetch(`/api/produto?id=${id}`);
        const data = await res.json();

        // 🔥 segurança extra
        if (data && data.id) {
          setProduto(data);
        } else {
          console.error("Produto inválido:", data);
        }

      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduto();
  }, [id]);

  // ===============================
  // CEP AUTOMÁTICO
  // ===============================
  useEffect(() => {
    if (!cliente.cep || cliente.cep.length < 8) return;

    async function buscarCep() {
      try {
        const cepLimpo = cliente.cep.replace(/\D/g, "");

        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();

        if (data.erro) {
          setCepErro(true);
          return;
        }

        setCepErro(false);

        setCliente((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));

      } catch {
        setCepErro(true);
      }
    }

    buscarCep();
  }, [cliente.cep]);

  // ===============================
  function handleChange(campo, valor) {
    setCliente((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  // ===============================
  // FRETE
  // ===============================
  async function calcularFrete() {

    if (!produto) return;
    if (!cliente.cep) return alert("Digite o CEP");

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

      let lista = data.options || data || [];

      lista = lista.filter(
        (f) => Number(f.price || f.cost || f.valor || 0) > 0
      );

      lista.sort(
        (a, b) =>
          Number(a.price || a.cost || a.valor || 0) -
          Number(b.price || b.cost || b.valor || 0)
      );

      setFretes(lista);

    } catch (err) {
      console.error("Erro frete:", err);
    } finally {
      setLoadingFrete(false);
    }
  }

  // ===============================
  const valorProduto = Number(produto?.preco || 0);
  const valorFrete = Number(
    freteSelecionado?.price ||
    freteSelecionado?.cost ||
    freteSelecionado?.valor ||
    0
  );

  const total = valorProduto + valorFrete;

  // ===============================
  function falarWhatsapp() {
    const mensagem = encodeURIComponent(
      `Olá, tenho interesse no produto ${produto?.nome}`
    );

    window.open(
      `https://api.whatsapp.com/send?phone=5511984309480&text=${mensagem}`
    );
  }

  // ===============================
  async function comprar() {

    if (!cliente.nome || !cliente.telefone || !cliente.cep) {
      return alert("Preencha os dados obrigatórios");
    }

    if (!freteSelecionado) {
      return alert("Selecione um frete");
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cliente,
          nome: produto.nome,
          preco: produto.preco,
          frete: freteSelecionado,
          canto: cliente.canto || "",
        }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      }

    } catch (err) {
      console.error("Erro compra:", err);
    }
  }

  // ===============================
  if (loading) return <p>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  // ===============================
  return (
    <div style={container}>
      <div style={card}>

        <div style={imgContainer}>
          <img src={produto.imagem} style={img} />
        </div>

        <div style={{ flex: 1 }}>
          <h1>{produto.nome}</h1>

          <h2 style={{ color: "green" }}>
            {Number(produto.preco).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>

          <p>{produto.descricao}</p>

          {produto.descricao_completa && (
            <div style={descricaoBox}>
              {produto.descricao_completa}
            </div>
          )}

          <p style={{ color: "red" }}>
            Restam apenas {produto.estoque} unidades
          </p>

          <hr />

          {/* FORMULÁRIO COMPLETO */}
          <input placeholder="Digite seu CEP" style={input}
            onChange={(e) => handleChange("cep", e.target.value)} />

          <input placeholder="Seu nome" style={input}
            onChange={(e) => handleChange("nome", e.target.value)} />

          <input placeholder="Telefone" style={input}
            onChange={(e) => handleChange("telefone", e.target.value)} />

          <input placeholder="CPF" style={input}
            onChange={(e) => handleChange("cpf", e.target.value)} />

          <input placeholder="Endereço" style={input}
            value={cliente.endereco || ""}
            onChange={(e) => handleChange("endereco", e.target.value)} />

          <input placeholder="Número" style={input}
            onChange={(e) => handleChange("numero", e.target.value)} />

          <input placeholder="Bairro" style={input}
            value={cliente.bairro || ""}
            onChange={(e) => handleChange("bairro", e.target.value)} />

          <input placeholder="Cidade" style={input}
            value={cliente.cidade || ""}
            onChange={(e) => handleChange("cidade", e.target.value)} />

          <input placeholder="Estado" style={input}
            value={cliente.estado || ""}
            onChange={(e) => handleChange("estado", e.target.value)} />

          {/* CAMPO CANTO (APENAS PEN DRIVE) */}
          {produto.nome?.toLowerCase().includes("pen drive") && (
            <input placeholder="Digite o canto" style={input}
              onChange={(e) => handleChange("canto", e.target.value)} />
          )}

          <button style={btn} onClick={calcularFrete}>
            Calcular Frete
          </button>

          <button style={btn} onClick={comprar}>
            Compra segura
          </button>

          {fretes.map((f, i) => {
            const valor = Number(f.price || f.cost || f.valor || 0);

            return (
              <div key={i}>
                <input
                  type="radio"
                  name="frete"
                  onChange={() => setFreteSelecionado(f)}
                />
                {f.name} - {valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            );
          })}

          <h3>
            Total: {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>

          <button style={whats} onClick={falarWhatsapp}>
            Falar no WhatsApp
          </button>

        </div>
      </div>
    </div>
  );
}

// ===============================
const container = { padding: 20 };

const card = {
  display: "flex",
  gap: 30,
  maxWidth: 1000,
  margin: "0 auto",
  flexWrap: "wrap",
};

const imgContainer = {
  width: 350,
  height: 350,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const img = {
  width: "100%",
  maxWidth: 320,
  objectFit: "contain",
};

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

const whats = {
  marginTop: 10,
  padding: 12,
  width: "100%",
  backgroundColor: "green",
  color: "white",
};

const descricaoBox = {
  marginTop: 15,
  padding: 15,
};