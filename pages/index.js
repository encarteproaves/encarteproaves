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

      setFretes((prev) => ({
        ...prev,
        [produto.id]: fretesOrdenados,
      }));

    } catch {
      alert("Erro ao calcular frete");
    }

    setLoadingFrete((prev) => ({
      ...prev,
      [produto.id]: false,
    }));
  };

  const compraSegura = async (produto) => {
    if (!fretes[produto.id]?.length) {
      alert("Calcule o frete primeiro");
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
    window.open(data.init_point, "_blank");
  };

  const falarWhatsapp = (produto) => {
    const mensagem = `Olá! Tenho interesse no produto: ${produto.nome}`;
    window.open(
      `https://wa.me/5511984309480?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  };

  return (
    <div style={{ background: "#f1f1f1", minHeight: "100vh" }}>

      {/* HEADER RESPONSIVO */}
      <header
        style={{
          background: "#000",
          color: "#FFD700",
          textAlign: "center",
          padding: "15px 10px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px" }}>ENCARTEPROAVES</h2>
        <p style={{ margin: 0, fontSize: "12px" }}>
          Tecnologia e Qualidade Para o Melhor Encarte de Canto
        </p>
      </header>

      {/* GRID RESPONSIVO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          padding: "15px",
          maxWidth: "1200px",
          margin: "0 auto",
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
            }}
          >
            <img
              src={p.imagem}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "contain",
              }}
            />

            <h3 style={{ fontSize: "16px" }}>{p.nome}</h3>

            <p style={{ color: "green", fontWeight: "bold" }}>
              R$ {formatarMoeda(p.preco)}
            </p>

            {p.nome.includes("Pen Drive") && (
              <input
                placeholder="Digite o nome do canto"
                onChange={(e) =>
                  handleCantoChange(p.id, e.target.value)
                }
                style={{ width: "100%", marginBottom: "5px" }}
              />
            )}

            <input
              placeholder="Digite seu CEP"
              onChange={(e) =>
                handleCepChange(p.id, e.target.value)
              }
              style={{ width: "100%" }}
            />

            <button onClick={() => calcularFrete(p)}>
              Calcular Frete
            </button>

            {loadingFrete[p.id] && <p>Calculando...</p>}

            {fretes[p.id]?.map((f, i) => (
              <p key={i}>
                {f.name} - R$ {formatarMoeda(f.price)}
              </p>
            ))}

            <button onClick={() => compraSegura(p)}>
              Compra segura
            </button>

            <button
              onClick={() => falarWhatsapp(p)}
              style={{
                background: "#25D366",
                color: "#fff",
                width: "100%",
                marginTop: "5px",
              }}
            >
              Falar no WhatsApp
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER RESPONSIVO */}
      <footer
        style={{
          background: "#000",
          color: "#FFD700",
          padding: "20px 10px",
          textAlign: "center",
        }}
      >
        <p>ENCARTEPROAVES</p>
        <p>WhatsApp: (11) 98430-9480</p>
        <p style={{ fontSize: "12px" }}>
          © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}