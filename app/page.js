"use client";
import { useState } from "react";

export default function Home() {

  const products = [
    {
      name: "Caixa Acústica profissional para encarte de canto",
      description:
        "Caixa acústica profissional 65x65x35 cm em MDF 15mm com excelente propagação sonora para treinamento de canto.",
      price: 1500,
      image: "/caixa-nova.png",
      mpLink: "https://mpago.la/2foFNjY",
      estoque: 3
    },
    {
      name: "Aparelho Digital para encarte de canto",
      description:
        "Aparelho digital automático com programações inteligentes para treino contínuo de canto.",
      price: 330,
      image: "/aparelho-novo.jpg",
      mpLink: "https://mpago.la/1Po2ehy",
      estoque: 8
    },
    {
      name: "Pen Drive 8GB com canto editado",
      description:
        "Pen drive com canto editado conforme pedido do cliente, pronto para treino profissional.",
      price: 150,
      image: "/pendrive-8gb.jpg",
      mpLink: "https://wa.me/5511984309480",
      estoque: 12
    }
  ];

  const [cep, setCep] = useState({});
  const [frete, setFrete] = useState({});

  async function calcularFrete(index) {
    if (!cep[index]) return alert("Digite o CEP");

    const response = await fetch("/api/frete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cep: cep[index]
      })
    });

    const data = await response.json();

    setFrete({
      ...frete,
      [index]: data.valor
    });
  }

  return (
    <main style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* HEADER */}
      <header
        style={{
          background: "#111",
          padding: "40px 20px",
          textAlign: "center",
          position: "relative"
        }}
      >
        <img
          src="/logo.png"
          style={{
            width: "240px",
            display: "block",
            margin: "0 auto"
          }}
        />

        <div
          style={{
            color: "#f5d76e",
            fontSize: "22px",
            fontWeight: "700",
            marginTop: "10px"
          }}
        >
          Tecnologia e Qualidade para o Melhor Encarte de Canto
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "3px",
            background: "linear-gradient(90deg,#c9a227,#f5d76e,#c9a227)"
          }}
        />
      </header>

      {/* PRODUTOS */}
      <section
        style={{
          padding: "40px 20px",
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {products.map((product, index) => (

          <div
            key={index}
            style={{
              width: "320px",
              background: "#fff",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              paddingBottom: "20px"
            }}
          >

            {/* MAIS VENDIDO */}
            {index === 0 && (
              <div
                style={{
                  background: "#ffb300",
                  color: "#000",
                  padding: "6px",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                MAIS VENDIDO
              </div>
            )}

            {/* IMAGEM */}
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff"
              }}
            >
              <img
                src={product.image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>

            <h2 style={{ padding: "10px" }}>{product.name}</h2>

            <p style={{ padding: "0 15px", color: "#555" }}>
              {product.description}
            </p>

            <h3 style={{ marginTop: "10px", textAlign: "center" }}>
              R$ {product.price.toFixed(2)}
            </h3>

            {/* ESTOQUE */}
            <div
              style={{
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
                marginTop: "5px"
              }}
            >
              Restam apenas {product.estoque} unidades
            </div>

            {/* AVALIAÇÕES */}
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              ⭐⭐⭐⭐⭐ (27 avaliações)
            </div>

            {/* PERSONALIZAÇÃO PEN DRIVE */}
            {product.name.includes("Pen Drive") && (
              <textarea
                placeholder="Escreva qual canto deseja gravar..."
                style={{
                  width: "90%",
                  margin: "10px auto",
                  display: "block",
                  height: "70px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  padding: "10px"
                }}
              />
            )}

            {/* CEP */}
            <div style={{ padding: "0 20px" }}>
              <input
                placeholder="Digite seu CEP"
                value={cep[index] || ""}
                onChange={(e) =>
                  setCep({
                    ...cep,
                    [index]: e.target.value
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginTop: "10px"
                }}
              />

              <button
                onClick={() => calcularFrete(index)}
                style={{
                  width: "100%",
                  background: "#000",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "8px",
                  cursor: "pointer"
                }}
              >
                Calcular Frete
              </button>

              {frete[index] && (
                <div style={{ marginTop: "8px", fontWeight: "bold" }}>
                  Frete: R$ {frete[index]}
                </div>
              )}
            </div>

            {/* BOTÕES */}
            <div style={{ padding: "0 20px" }}>

              <a
                href={product.mpLink}
                target="_blank"
                style={{
                  display: "block",
                  background: "#000",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  marginTop: "12px",
                  fontWeight: "bold"
                }}
              >
                Compra Segura
              </a>

              <a
                href="https://wa.me/5511984309480"
                target="_blank"
                style={{
                  display: "block",
                  background: "#25D366",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  marginTop: "8px",
                  fontWeight: "bold"
                }}
              >
                Falar no WhatsApp
              </a>

            </div>

          </div>

        ))}
      </section>

      {/* BOTÃO WHATSAPP FLUTUANTE */}
      <a
        href="https://wa.me/5511984309480"
        target="_blank"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          style={{ width: "30px" }}
        />
      </a>

    </main>
  );
}
