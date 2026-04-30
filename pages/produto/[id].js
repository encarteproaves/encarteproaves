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
      console.log("FRETES API:", data);

      setFretes(data.options || data || []);
    } catch (err) {
      console.error("Erro frete:", err);
    } finally {
      setLoadingFrete(false);
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

  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        
        {/* IMAGEM */}
        <div>
          <img
            src={produto.imagem}
            alt={produto.nome}
            style={{ width: 300, borderRadius: 10 }}
          />
        </div>

        {/* INFO */}
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
            Restam apenas {produto.estoque} unidades
          </p>

          <hr />

          {/* FORMULÁRIO */}
          <input placeholder="Digite seu CEP" style={input} onChange={(e) => handleChange("cep", e.target.value)} />
          <input placeholder="Seu nome" style={input} onChange={(e) => handleChange("nome", e.target.value)} />
          <input placeholder="Telefone" style={input} onChange={(e) => handleChange("telefone", e.target.value)} />
          <input placeholder="CPF" style={input} onChange={(e) => handleChange("cpf", e.target.value)} />
          <input placeholder="Endereço" style={input} onChange={(e) => handleChange("endereco", e.target.value)} />
          <input placeholder="Número" style={input} onChange={(e) => handleChange("numero", e.target.value)} />
          <input placeholder="Bairro" style={input} onChange={(e) => handleChange("bairro", e.target.value)} />
          <input placeholder="Cidade" style={input} onChange={(e) => handleChange("cidade", e.target.value)} />
          <input placeholder="Estado" style={input} onChange={(e) => handleChange("estado", e.target.value)} />

          {/* CAMPO CANTO */}
          <input placeholder="Digite o canto" style={input} onChange={(e) => handleChange("canto", e.target.value)} />

          {/* BOTÕES */}
          <div style={{ marginTop: 10 }}>
            <button style={btn} onClick={calcularFrete}>
              Calcular Frete
            </button>

            <button
              style={btn}
              onClick={() => {
                if (!freteSelecionado) {
                  alert("Selecione um frete primeiro");
                  return;
                }

                console.log("CHECKOUT:", {
                  produto,
                  frete: freteSelecionado,
                  cliente,
                });

                // futura integração pagamento aqui
              }}
            >
              Compra segura
            </button>
          </div>

          {/* FRETE */}
          {loadingFrete && <p>Calculando frete...</p>}

          {Array.isArray(fretes) &&
            fretes
              .filter((f) => Number(f.price || f.cost || f.valor || 0) > 0)
              .sort(
                (a, b) =>
                  Number(a.price || a.cost || a.valor || 0) -
                  Number(b.price || b.cost || b.valor || 0)
              )
              .map((f, i) => {
                const valor = Number(f.price || f.cost || f.valor || 0);

                return (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <label style={{ cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="frete"
                        onChange={() => setFreteSelecionado(f)}
                      />

                      {" "}
                      {f.name} -{" "}
                      {valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}{" "}
                      ({f.delivery_time || f.delivery_days || "?"} dias)
                    </label>
                  </div>
                );
              })}

          {freteSelecionado && (
            <p style={{ color: "green" }}>
              Frete escolhido: {freteSelecionado.name}
            </p>
          )}

          {/* WHATSAPP */}
          <button style={whats} onClick={falarWhatsapp}>
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

const whats = {
  marginTop: 10,
  padding: 12,
  width: "100%",
  backgroundColor: "green",
  color: "white",
  border: "none",
};