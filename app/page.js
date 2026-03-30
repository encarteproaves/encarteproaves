"use client";
import { useState, useEffect } from "react";

export default function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/public/produto");

        if (!res.ok) {
          console.log("Erro HTTP:", res.status);
          return;
        }

        const data = await res.json();

        console.log("API FRONT:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.log("Resposta inválida:", data);
        }

      } catch (err) {
        console.log("Erro ao carregar produtos:", err);
      }
    }

    carregar();
  }, []);

  // 🔁 PRODUTOS FIXOS (fallback)
  const produtosFixos = [
    {
      id: "fixo-1",
      name: "Caixa Acústica Profissional para Encarte de Canto em pássaros",
      description: "Caixa acústica para encarte de canto em pássaros nas Medidas 65x65x35 cm",
      price: 1500,
      image: "/caixa-nova.png",
      estoque: 1,
      badge: "Mais Vendido",
      whatsappLink: "https://wa.me/5511984309480"
    },
    {
      id: "fixo-2",
      name: "Aparelho Digital para Encarte de Canto",
      description: "Programador digital automático para treino de canto",
      price: 330,
      image: "/aparelho-novo.jpg",
      estoque: 10,
      whatsappLink: "https://wa.me/5511984309480"
    },
    {
      id: "fixo-3",
      name: "Pen Drive 8GB Canto Editado",
      description: "Canto personalizado conforme pedido",
      price: 150,
      image: "/pendrive-8gb.jpg",
      estoque: 10,
      whatsappLink: "https://wa.me/5511984309480"
    }
  ];

  // ✅ REGRA CORRETA
  const lista = products.length > 0 ? products : produtosFixos;

  return (
    <main style={{ background: "#f5f5f5", fontFamily: "Arial" }}>

      <header style={{
        background: "#000",
        textAlign: "center",
        padding: "40px"
      }}>
        <img src="/logo.png" style={{ width: "240px" }} />
        <h2 style={{ color: "#f5d76e", marginTop: "10px" }}>
          Tecnologia e Qualidade Para o Melhor Encarte de Canto
        </h2>
      </header>

      <section style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "40px",
        padding: "50px"
      }}>

        {lista.map((product, index) => (

          <div
            key={product.id || index}
            style={{
              width: "320px",
              background: "#fff",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,.08)",
              overflow: "hidden",
              textAlign: "center",
              paddingBottom: "20px"
            }}
          >

            {product.badge && (
              <div style={{
                background: "#ff0000",
                color: "#fff",
                padding: "6px",
                fontWeight: "bold"
              }}>
                {product.badge}
              </div>
            )}

            <div style={{ height: "280px" }}>
              <img
                src={product.imagem || product.image || "/placeholder.png"}
                alt={product.nome || product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>

            <h3>{product.nome || product.name}</h3>

            <p style={{ padding: "0 15px" }}>
              {product.descricao || product.description}
            </p>

            <h2 style={{ color: "#27ae60" }}>
              R$ {Number(product.preco || product.price || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })}
            </h2>

            <p style={{ color: "#e67e22" }}>
              Restam apenas {product.estoque || 1} unidades
            </p>

            <a
              href={product.whatsappLink || "https://wa.me/5511984309480"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "#25D366",
                color: "#fff",
                margin: "20px",
                padding: "12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Falar no WhatsApp
            </a>

          </div>
        ))}
      </section>
    </main>
  );
}