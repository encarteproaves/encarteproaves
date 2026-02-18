"use client";
import { useState } from "react";

export default function Home() {
  const [frete, setFrete] = useState({});
  const [cep, setCep] = useState("");

  const products = [
    {
      name: "Caixa Acústica",
      price: 1500,
      mpLink: "https://mpago.la/2foFNjY",
      image: "/caixa-nova.png",
      description:
        "Caixa acústica para encarte de canto, com medidas 65x65x35 cm, vidro temperado, alto falante de alto rendimento e design robusto em MDF de 15mm."
    },
    {
      name: "Aparelho Digital",
      price: 330,
      mpLink: "https://mpago.la/1Po2ehy",
      image: "/aparelho-novo.jpg", // 🔥 NOVA IMAGEM AQUI
      description:
        "Aparelho digital para encarte de canto, com até 8 programações de liga/desliga, toca pen drive e cartão de memória, além de rádio AM/FM."
    }
  ];

  const calcularFrete = (productName) => {
    if (!cep) {
      alert("Digite o CEP!");
      return;
    }

    const valorFrete = 20;
    setFrete({ ...frete, [productName]: valorFrete });
  };

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        background: "#f4f6f8",
        minHeight: "100vh"
      }}
    >
      <header
        style={{
          background: "#000",
          padding: "40px",
          color: "#f5d76e",
          textAlign: "center",
          fontFamily: "Arial Black"
        }}
      >
        <img src="/logo.png" style={{ width: "220px" }} />
        <h1>Encarte Pro Aves</h1>
        <p>Tecnologia e Qualidade para o Melhor Encarte de Canto</p>
      </header>

      <section
        style={{
          padding: "60px 20px",
          display: "flex",
          justifyContent: "center",
          gap: "50px",
          flexWrap: "wrap"
        }}
      >
        {products.map((product, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              width: "350px",
              borderRadius: "18px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              overflow: "hidden",
              textAlign: "center",
              paddingBottom: "25px"
            }}
          >
            {/* IMAGEM */}
            <div
              style={{
                width: "100%",
                height: "300px",
                backgroundColor:
                  product.name === "Aparelho Digital"
                    ? "#ffffff"
                    : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img
                src={product.image}
                style={{
                  width:
                    product.name === "Aparelho Digital"
                      ? "auto"
                      : "100%",
                  height:
                    product.name === "Aparelho Digital"
                      ? "85%"
                      : "100%",
                  objectFit:
                    product.name === "Aparelho Digital"
                      ? "contain"
                      : "cover"
                }}
              />
            </div>

            <h2 style={{ margin: "15px 0 5px" }}>
              {product.name}
            </h2>

            <p style={{ fontSize: "14px", color: "#555", padding: "0 20px" }}>
              {product.description}
            </p>

            <h3 style={{ color: "#0d3b26", margin: "15px 0" }}>
              R$ {product.price.toFixed(2)}
            </h3>

            {/* FRETE */}
            <div style={{ padding: "0 20px", marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                style={{
                  padding: "8px",
                  width: "65%",
                  borderRadius: "5px",
                  border: "1px solid #ccc"
                }}
              />
              <button
                onClick={() => calcularFrete(product.name)}
                style={{
                  padding: "8px 12px",
                  marginLeft: "5px",
                  background: "#0d3b26",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Calcular
              </button>

              {frete[product.name] && (
                <p style={{ marginTop: "8px", fontWeight: "bold" }}>
                  Frete: R$ {frete[product.name].toFixed(2)}
                </p>
              )}
            </div>

            {/* BOTÕES */}
            <div style={{ display: "flex", gap: "10px", padding: "0 20px" }}>
              <a
                href={product.mpLink}
                target="_blank"
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#ffc107",
                  color: "#000",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                Mercado Pago
              </a>

              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#0d3b26",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Carrinho
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
