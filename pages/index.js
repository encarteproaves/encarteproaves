import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [fretes, setFretes] = useState({});
  const [loadingFrete, setLoadingFrete] = useState({});
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetch("/api/produtos"); // ✅ corrigido
        const data = await res.json();
        setProdutos(data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    }
    carregarProdutos();
  }, []);

  function handleClienteChange(id, campo, valor) {
    setCliente((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  }

  async function calcularFrete(p) {
    try {
      setLoadingFrete((prev) => ({ ...prev, [p.id]: true }));

      const res = await fetch("/api/frete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ corrigido
        },
        body: JSON.stringify({ produto: p }),
      });

      const data = await res.json();

      setFretes((prev) => ({
        ...prev,
        [p.id]: data,
      }));
    } catch (err) {
      console.error("Erro frete:", err);
    } finally {
      setLoadingFrete((prev) => ({ ...prev, [p.id]: false }));
    }
  }

  function selecionarFrete(id, frete) {
    console.log("Frete selecionado:", id, frete);
  }

  function compraSegura(p) {
    console.log("Compra:", p);
  }

  function falarWhatsapp(p) {
    window.open(`https://wa.me/5511984309480?text=Tenho interesse no produto ${p.nome}`);
  }

  function formatarMoeda(v) {
    return Number(v || 0).toFixed(2);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>ENCARTEPROAVES</h1>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {produtos.map((p) => (
          <div key={p.id} style={{ width: 250, border: "1px solid #ccc", padding: 10 }}>

            <img
              src={p.imagem || "/placeholder.png"} // ✅ segurança
              style={{ width: "100%" }}
            />

            <h3>{p.nome}</h3>

            <p style={{ color: "green" }}>
              R$ {formatarMoeda(p.preco)}
            </p>

            <p style={{ color: "red" }}>
              Restam apenas {p.estoque || 0} unidades
            </p>

            <input placeholder="Digite seu CEP" onChange={(e) => handleClienteChange(p.id, "cep", e.target.value)} />
            <input placeholder="Seu nome" onChange={(e) => handleClienteChange(p.id, "nome", e.target.value)} />
            <input placeholder="Telefone" onChange={(e) => handleClienteChange(p.id, "telefone", e.target.value)} />
            <input placeholder="CPF" onChange={(e) => handleClienteChange(p.id, "cpf", e.target.value)} />
            <input placeholder="Endereço" onChange={(e) => handleClienteChange(p.id, "endereco", e.target.value)} />
            <input placeholder="Número" onChange={(e) => handleClienteChange(p.id, "numero", e.target.value)} />
            <input placeholder="Bairro" onChange={(e) => handleClienteChange(p.id, "bairro", e.target.value)} />
            <input placeholder="Cidade" onChange={(e) => handleClienteChange(p.id, "cidade", e.target.value)} />
            <input placeholder="Estado" onChange={(e) => handleClienteChange(p.id, "estado", e.target.value)} />

            <button onClick={() => calcularFrete(p)}>Calcular Frete</button>

            {loadingFrete[p.id] && <p>Calculando...</p>}

            {fretes[p.id]?.map((f, i) => (
              <div key={i}>
                <label>
                  <input
                    type="radio"
                    name={`frete-${p.id}`}
                    onChange={() => selecionarFrete(p.id, f)}
                  />
                  {f.name} - R$ {formatarMoeda(f.price)} ({f.delivery_time} dias)
                </label>
              </div>
            ))}

            {/* LINK CORRIGIDO */}
            {p?.id && (
              <Link
                href={`/produto/${p.id}`}
                style={{
                  display: "block",
                  marginTop: "5px",
                  width: "100%",
                  textAlign: "center",
                  padding: "10px",
                  background: "#ddd",
                  borderRadius: "4px",
                }}
              >
                Ver detalhes
              </Link>
            )}

            <button onClick={() => compraSegura(p)}>Compra segura</button>

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
    </main>
  );
}