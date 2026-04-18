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

  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calcularFrete = async (produto) => {
    const cep = ceps[produto.id];

    if (!cep || cep.length < 8) {
      alert("Digite um CEP válido");
      return;
    }

    setLoadingFrete((prev) => ({
      ...prev,
      [produto.id]: true,
    }));

    try {
      const res = await fetch("/api/frete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cep,
          width: produto.width || 20,
          height: produto.height || 10,
          length: produto.length || 20,
          weight: produto.weight || 1,
          price: produto.preco,
        }),
      });

      const data = await res.json();

      const fretesOrdenados = Array.isArray(data)
        ? data
            .filter((item) => !item.error)
            .sort((a, b) => Number(a.price) - Number(b.price))
        : [];

      if (!fretesOrdenados.length) {
        alert("Nenhuma opção de frete encontrada");
      }

      setFretes((prev) => ({
        ...prev,
        [produto.id]: fretesOrdenados,
      }));

    } catch (error) {
      alert("Erro ao calcular frete");
    }

    setLoadingFrete((prev) => ({
      ...prev,
      [produto.id]: false,
    }));
  };

  const compraSegura = async (produto) => {
    try {
      if (!fretes[produto.id]?.length) {
        alert("Calcule o frete antes de continuar");
        return;
      }

      const freteSelecionado = fretes[produto.id][0];

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: produto.nome,
          preco: produto.preco,
          cep: ceps[produto.id] || "",
          frete: freteSelecionado,
          canto: cantos[produto.id] || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro no checkout");
      }

      window.open(data.init_point, "_blank");

    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao iniciar checkout");
    }
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
    <div
      style={{
        background: "#f1f1f1",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER ORIGINAL */}
      <header
        style={{
          background: "#000",
          color: "#FFD700",
          textAlign: "center",
          padding: "20px 10px",
        }}
      >
        <h2 style={{ margin: 0 }}>ENCARTEPROAVES</h2>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Tecnologia e Qualidade Para o Melhor Encarte de Canto
        </p>
      </header>

      {/* CONTEÚDO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
          flex: 1,
        }}
      >
        {produtos.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
              maxWidth: "320px",
              margin: "0 auto",
            }}
          >
            <img
              src={p.imagem}
              alt={p.nome}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain",
              }}
            />

            <h3>{p.nome}</h3>

            <p style={{ color: "green", fontWeight: "bold" }}>
              R$ {formatarMoeda(p.preco)}
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
                  marginBottom: "8px",
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
                padding: "8px",
              }}
            />

            <button onClick={() => calcularFrete(p)} style={{ width: "100%", marginTop: "8px" }}>
              Calcular Frete
            </button>

            {loadingFrete[p.id] && <p>Calculando frete...</p>}

            {fretes[p.id]?.length > 0 && (
              <div style={{ marginTop: "10px", textAlign: "left", fontSize: "13px" }}>
                {fretes[p.id].map((frete, index) => (
                  <div key={index}>
                    <strong>{frete.name}</strong><br />
                    R$ {formatarMoeda(frete.price)}<br />
                    Prazo: {frete.delivery_time} dias
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => compraSegura(p)} style={{ width: "100%", marginTop: "8px" }}>
              Compra segura
            </button>

            <button
              onClick={() => falarWhatsapp(p)}
              style={{
                width: "100%",
                marginTop: "8px",
                background: "#25D366",
                color: "#fff",
                border: "none",
                padding: "10px",
              }}
            >
              Falar no WhatsApp
            </button>
          </div>
        ))}
      </div>

      {/* ✅ RODAPÉ RESTAURADO */}
      <footer
        style={{
          background: "#000",
          color: "#FFD700",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <p style={{ margin: 0 }}>
          ENCARTEPROAVES © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}