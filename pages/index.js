import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [ceps, setCeps] = useState({});
  const [cantos, setCantos] = useState({});
  const [fretes, setFretes] = useState({});
  const [loadingFrete, setLoadingFrete] = useState({});

  useEffect(() => {
    fetch("/api/produto")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  const handleCepChange = (id, value) => {
    setCeps((prev) => ({ ...prev, [id]: value }));
  };

  const handleCantoChange = (id, value) => {
    setCantos((prev) => ({ ...prev, [id]: value }));
  };

  const calcularFrete = async (produto) => {
    const cep = ceps[produto.id];

    if (!cep) {
      alert("Digite um CEP válido");
      return;
    }

    setLoadingFrete((prev) => ({
      ...prev,
      [produto.id]: true
    }));

    try {
      const res = await fetch("/api/frete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cep,
          width: 20,
          height: 10,
          length: 20,
          weight: 1,
          price: produto.preco
        })
      });

      const data = await res.json();

      const fretesOrdenados = data
        .filter((item) => !item.error)
        .sort((a, b) => Number(a.price) - Number(b.price));

      setFretes((prev) => ({
        ...prev,
        [produto.id]: fretesOrdenados
      }));

    } catch (error) {
      alert("Erro ao calcular frete");
    }

    setLoadingFrete((prev) => ({
      ...prev,
      [produto.id]: false
    }));
  };

  const compraSegura = (produto) => {
    alert(`Configurar checkout para ${produto.nome}`);
  };

  const falarWhatsapp = (produto) => {
    const cep = ceps[produto.id] || "";
    const canto = cantos[produto.id] || "";

    let mensagem = `Olá! Tenho interesse no produto: ${produto.nome}`;

    if (cep) mensagem += ` | CEP: ${cep}`;
    if (canto) mensagem += ` | Canto desejado: ${canto}`;

    window.open(
      `https://wa.me/5511984309480?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  };

  return (
    <div style={{ background: "#f1f1f1", minHeight: "100vh" }}>
      <header style={{
        background: "#000",
        color: "#FFD700",
        textAlign: "center",
        padding: "20px 10px"
      }}>
        <h2 style={{ margin: 0 }}>ENCARTEPROAVES</h2>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Tecnologia e Qualidade Para o Melhor Encarte de Canto
        </p>
      </header>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px",
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {produtos.map((p) => (
          <div key={p.id} style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "320px",
            margin: "0 auto"
          }}>
            <img
              src={p.imagem}
              alt={p.nome}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain"
              }}
            />

            <h3>{p.nome}</h3>

            <p style={{
              color: "green",
              fontWeight: "bold"
            }}>
              R$ {Number(p.preco).toFixed(2)}
            </p>

            <p>{p.descricao}</p>

            <p style={{ color: "red" }}>
              Restam apenas {p.estoque} unidades
            </p>

            {p.nome.includes("Pen Drive") && (
              <input
                placeholder="Digite o nome do canto"
                value={cantos[p.id] || ""}
                onChange={(e) =>
                  handleCantoChange(p.id, e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "8px"
                }}
              />
            )}

            <input
              placeholder="Digite seu CEP"
              value={ceps[p.id] || ""}
              onChange={(e) =>
                handleCepChange(p.id, e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px"
              }}
            />

            <button
              onClick={() => calcularFrete(p)}
              style={{
                width: "100%",
                marginTop: "8px"
              }}
            >
              Calcular Frete
            </button>

            {loadingFrete[p.id] && (
              <p style={{ marginTop: "8px" }}>
                Calculando frete...
              </p>
            )}

            {fretes[p.id]?.length > 0 && (
              <div style={{
                marginTop: "10px",
                textAlign: "left",
                fontSize: "13px",
                background: "#f8f8f8",
                padding: "10px",
                borderRadius: "6px"
              }}>
                {fretes[p.id].map((frete, index) => (
                  <div key={index} style={{
                    marginBottom: "8px"
                  }}>
                    <strong>{frete.name}</strong><br />
                    R$ {Number(frete.price).toFixed(2)}<br />
                    Prazo: {frete.delivery_time} dias
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => compraSegura(p)}
              style={{
                width: "100%",
                marginTop: "8px"
              }}
            >
              Compra segura
            </button>

            <button
              onClick={() => falarWhatsapp(p)}
              style={{
                width: "100%",
                marginTop: "8px",
                background: "#25D366",
                color: "#fff"
              }}
            >
              Falar no WhatsApp
            </button>
          </div>
        ))}
      </div>

      <footer style={{
        background: "#0b1a2c",
        color: "#fff",
        padding: "30px",
        marginTop: "40px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap"
        }}>
          <div>
            <h3>Encarteproaves</h3>
            <p>Tecnologia e Qualidade no Encarte de Canto de pássaros.</p>
          </div>

          <div>
            <h4>Links</h4>
            <a href="/admin/produtos" style={{ color: "#fff" }}>
              Admin
            </a>
          </div>

          <div>
            <h4>Contato</h4>

            <p>
              <a
                href="https://wa.me/5511984309480"
                target="_blank"
                style={{ color: "#fff" }}
              >
                Falar no WhatsApp
              </a>
            </p>

            <p>
              <a
                href="mailto:encarteproaves@gmail.com"
                style={{ color: "#fff" }}
              >
                encarteproaves@gmail.com
              </a>
            </p>
          </div>
        </div>

        <p style={{
          textAlign: "center",
          marginTop: "20px"
        }}>
          © 2026 Encarteproaves
        </p>
      </footer>
    </div>
  );
}