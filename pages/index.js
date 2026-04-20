import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [ceps, setCeps] = useState({});
  const [cantos, setCantos] = useState({});
  const [fretes, setFretes] = useState({});
  const [freteSelecionado, setFreteSelecionado] = useState({});
  const [loadingFrete, setLoadingFrete] = useState({});
  const [clientes, setClientes] = useState({});

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

  const handleClienteChange = (id, campo, valor) => {
    setClientes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  };

  const selecionarFrete = (produtoId, frete) => {
    setFreteSelecionado((prev) => ({
      ...prev,
      [produtoId]: frete,
    }));
  };

  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
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
    try {
      const frete = freteSelecionado[produto.id];

      // ✅ PROTEÇÃO IMPORTANTE
      if (!frete || !frete.price) {
        alert("Selecione um frete válido");
        return;
      }

      const cliente = clientes[produto.id] || {};

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: produto.nome,

          nome_cliente: cliente.nome_cliente || "",
          endereco: cliente.endereco || "",
          numero: cliente.numero || "",
          cidade: cliente.cidade || "",
          estado: cliente.estado || "",

          cep: ceps[produto.id] || "",
          preco: produto.preco,

          // ✅ CORREÇÃO DO FRETE
          frete: frete.price,

          canto: cantos[produto.id] || "",
        }),
      });

      const data = await res.json();

      if (!data.init_point) {
        throw new Error("Erro ao gerar pagamento");
      }

      // ✅ MELHOR PARA MOBILE
      window.location.href = data.init_point;

    } catch (error) {
      alert(error.message);
    }
  };

  const falarWhatsapp = (produto) => {
    const texto = `Olá, tenho interesse no produto: ${produto.nome}`;
    const url = `https://wa.me/5511984309480?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f1f1f1",
      }}
    >

      <header style={{ background: "#000", color: "#FFD700", textAlign: "center", padding: "20px" }}>
        <h2 style={{ margin: 0 }}>ENCARTEPROAVES</h2>
        <p style={{ margin: 0 }}>
          Tecnologia e Qualidade Para o Melhor Encarte de Canto
        </p>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "25px",
            padding: "30px",
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {produtos.map((p) => (
            <div key={p.id} style={{ background: "#fff", borderRadius: "10px", padding: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>

              <img src={p.imagem} style={{ width: "100%", height: "180px", objectFit: "contain" }} />

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
                  onChange={(e) => handleCantoChange(p.id, e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              )}

              <input placeholder="Digite seu CEP" onChange={(e) => handleCepChange(p.id, e.target.value)} style={{ width: "100%" }} />

              <input placeholder="Seu nome" onChange={(e) => handleClienteChange(p.id, "nome_cliente", e.target.value)} style={{ width: "100%", marginTop: "5px" }} />
              <input placeholder="Endereço" onChange={(e) => handleClienteChange(p.id, "endereco", e.target.value)} style={{ width: "100%", marginTop: "5px" }} />
              <input placeholder="Número" onChange={(e) => handleClienteChange(p.id, "numero", e.target.value)} style={{ width: "100%", marginTop: "5px" }} />
              <input placeholder="Cidade" onChange={(e) => handleClienteChange(p.id, "cidade", e.target.value)} style={{ width: "100%", marginTop: "5px" }} />
              <input placeholder="Estado" onChange={(e) => handleClienteChange(p.id, "estado", e.target.value)} style={{ width: "100%", marginTop: "5px" }} />

              <button onClick={() => calcularFrete(p)}>Calcular Frete</button>

              {loadingFrete[p.id] && <p>Calculando...</p>}

              {fretes[p.id]?.map((f, i) => (
                <div key={i}>
                  <label>
                    <input type="radio" name={`frete-${p.id}`} onChange={() => selecionarFrete(p.id, f)} />
                    {f.name} - R$ {formatarMoeda(f.price)} ({f.delivery_time} dias)
                  </label>
                </div>
              ))}

              <button onClick={() => compraSegura(p)}>Compra segura</button>

              <button onClick={() => falarWhatsapp(p)} style={{ background: "#25D366", color: "#fff", width: "100%", marginTop: "5px" }}>
                Falar no WhatsApp
              </button>
            </div>
          ))}
        </div>

      </main>

      <footer style={{ background: "#000", color: "#FFD700", padding: "30px 20px" }}>
        <div style={{ textAlign: "center" }}>
          © {new Date().getFullYear()} ENCARTEPROAVES
        </div>
      </footer>
    </div>
  );
}