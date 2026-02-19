"use client";
import { useState } from "react";

export default function Home() {

  /* PRODUTOS */
  const products = [
    {
      name: "Caixa Acústica profissional para encarte de canto",
      description: "Caixa acústica profissional para encarte de canto em pássaros nas medidas 65x65x35 cm, resistente e com excelente propagação sonora.",
      price: 1500,
      image: "/caixa-nova.png",
      mpLink: "https://mpago.la/2foFNjY",
      estoque: 3,
      maisVendido: true
    },
    {
      name: "Aparelho Digital para encarte de canto",
      description: "Aparelho digital com programações automáticas para manter o treino do canto com regularidade.",
      price: 330,
      image: "/aparelho-novo.jpg",
      mpLink: "https://mpago.la/1Po2ehy",
      estoque: 8
    },
    {
      name: "Pen Drive 8GB",
      description: "Pen drive com canto editado conforme pedido do cliente",
      price: 150,
      image: "/pendrive-8gb.jpg",
      mpLink: "https://wa.me/5511984309480",
      estoque: 20
    }
  ];

  /* ESTADOS */
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState("");
  const [canto, setCanto] = useState("");

  /* FRETE */
  const calcularFrete = () => {
    if (!cep || cep.length < 8) {
      alert("Digite um CEP válido");
      return;
    }
    setFrete("Frete estimado: R$ 25,00");
  };

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f5f5f5" }}>

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
            marginBottom: "10px"
          }}
        />

        <div
          style={{
            color: "#f5d76e",
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "1px"
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
            background: "linear-gradient(90deg, #c9a227, #f5d76e, #c9a227)"
          }}
        />
      </header>


      {/* PRODUTOS */}
      <section
        style={{
          padding: "50px 15px",
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap"
        }}
      >

        {products.map((product, index) => (

          <div
            key={index}
            style={{
              width: "320px",
              maxWidth: "100%",
              background: "#fff",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              textAlign: "center",
              paddingBottom: "20px",
              position: "relative"
            }}
          >

            {/* SELO MAIS VENDIDO */}
            {product.maisVendido && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background: "#ffb300",
                  color: "#000",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "12px"
                }}
              >
                MAIS VENDIDO
              </div>
            )}

            {/* IMAGEM */}
            <div
              style={{
                width: "100%",
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
                  objectFit: product.name.includes("Aparelho") ? "contain" : "cover"
                }}
              />
            </div>

            <h2 style={{ padding: "10px" }}>{product.name}</h2>

            {/* AVALIAÇÕES */}
            <div style={{ color: "#ffb400", fontSize: "18px" }}>
              ★★★★★
            </div>

            <div style={{ fontSize: "13px", color: "#777" }}>
              +137 clientes satisfeitos
            </div>

            <p style={{ padding: "10px 15px", color: "#555" }}>
              {product.description}
            </p>

            <h3>R$ {product.price.toFixed(2)}</h3>

            {/* ESTOQUE */}
            <div style={{
              fontSize: "13px",
              color: "#d32f2f",
              fontWeight: "bold"
            }}>
              Restam apenas {product.estoque} unidades
            </div>

            {/* FRETE */}
            <div style={{ marginTop: "10px" }}>
              <input
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                style={{
                  width: "65%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />

              <button
                onClick={calcularFrete}
                style={{
                  marginLeft: "5px",
                  padding: "8px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#000",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Calcular
              </button>

              {frete && (
                <div style={{ marginTop: "5px", fontSize: "13px" }}>
                  {frete}
                </div>
              )}
            </div>

            {/* PERSONALIZAÇÃO PEN DRIVE */}
            {product.name === "Pen Drive 8GB" && (
              <textarea
                placeholder="Digite qual canto deseja gravar..."
                value={canto}
                onChange={(e) => setCanto(e.target.value)}
                style={{
                  width: "90%",
                  height: "70px",
                  marginTop: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  padding: "10px"
                }}
              />
            )}

            {/* BOTÕES */}
            <div style={{ padding: "15px" }}>

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
                  fontWeight: "bold"
                }}
              >
                Comprar Agora
              </a>

              {/* BOTÃO COMPRA SEGURA */}
              <div style={{
                marginTop: "8px",
                fontSize: "13px",
                color: "#2e7d32",
                fontWeight: "bold"
              }}>
                🔒 Compra 100% Segura
              </div>

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
                  marginTop: "10px",
                  fontWeight: "bold"
                }}
              >
                Falar no WhatsApp
              </a>

            </div>

          </div>

        ))}
      </section>


      {/* WHATSAPP FIXO */}
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
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          zIndex: 999
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


