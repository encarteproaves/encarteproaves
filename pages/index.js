// ===============================
// IMPORTAÇÕES
// ===============================
import { useEffect, useState } from "react";
import Link from "next/link";


// ===============================
// COMPONENTE PRINCIPAL (HOME)
// ===============================
export default function Home() {

  // ===============================
  // ESTADOS
  // ===============================
  const [produtos, setProdutos] = useState([]);

  // ===============================
  // CARREGAR PRODUTOS
  // ===============================
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetch("/api/produtos");
        const data = await res.json();
        setProdutos(data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    }

    carregarProdutos();
  }, []);

  // ===============================
  // WHATSAPP
  // ===============================
  function falarWhatsapp(p) {
    const mensagem = encodeURIComponent(
      `Olá, tenho interesse no produto ${p?.nome || ""}`
    );

    window.open(`https://wa.me/5511984309480?text=${mensagem}`);
  }

  // ===============================
  // FORMATAR MOEDA
  // ===============================
  function formatarMoeda(v) {
    return Number(v || 0).toFixed(2);
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <main style={{ padding: 20 }}>

      {/* TÍTULO */}
      <h1 style={{ textAlign: "center" }}>
        ENCARTEPROAVES
      </h1>

      {/* LISTA DE PRODUTOS */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {produtos.map((p) => (
          <div
            key={p.id}
            style={{
              width: 250,
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* IMAGEM */}
            <img
              src={p.imagem || "/placeholder.png"}
              alt={p.nome}
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />

            {/* NOME */}
            <h3>{p.nome}</h3>

            {/* PREÇO */}
            <p style={{ color: "green", fontWeight: "bold" }}>
              R$ {formatarMoeda(p.preco)}
            </p>

            {/* BOTÕES */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <Link
                href={`/produto/${p.id}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px",
                  background: "#0070f3",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                }}
              >
                Ver detalhes
              </Link>

              <button
                onClick={() => falarWhatsapp(p)}
                style={{
                  flex: 1,
                  background: "#25D366",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
// ===============================
// FIM COMPONENTE HOME
// ===============================