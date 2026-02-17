"use client";
import { useState } from "react";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [frete, setFrete] = useState({});
  const [cep, setCep] = useState("");

  const products = [
    {
      name: "Caixa Acústica",
      price: 1500,
      mpLink: "https://mpago.la/2foFNjY",
      image: "/caixa.jpg",
      description:
        "Caixa acústica para encarte de canto, com medidas 65x65x35 cm, vidro temperado, alto falante de alto rendimento e design robusto em MDF de 15mm."
    },
    {
      name: "Aparelho Digital",
      price: 330,
      mpLink: "https://mpago.la/1Po2ehy",
      image: "/aparelho-novo.jpg",
      description:
        "Aparelho digital para encarte de canto, com até 8 programações de liga/desliga, toca pen drive e cartão de memória, além de rádio AM/FM."
    }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    setOpenCart(true);
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price + (frete[item.name] || 0),
    0
  );

  const calcularFrete = (productName) => {
    if (!cep) {
      alert("Informe o CEP primeiro!");
      return;
    }
    const valorFrete = 20;
    setFrete({ ...frete, [productName]: valorFrete });
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f4f6f8",
        minHeight: "100vh"
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#000",
          padding: "40px 50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          color: "#f5d76e",
          fontFamily: "'Arial Black', Arial, sans-serif"
        }}
      >
        <img src="/logo.png" style={{ width: "250px" }} />

        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "30px", fontWeight: "900" }}>
            Encarte Pro Aves
          </div>
          <div style={{ fontSize: "18px", marginTop: "5px" }}>
            Tecnologia e Qualidade para o Melhor Encarte de Canto
          </div>
        </div>

        <div style={{ width: "250px" }}></div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background:
              "linear-gradient(90deg, #c9a227, #f5d76e, #c9a227)"
          }}
        />
      </header>

      {/* PRODUTOS */}
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
              backgroundColor: "#fff",
              width: "340px",
              borderRadius: "18px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              overflow: "hidden",
              textAlign: "center",
              paddingBottom: "25px",
              transition: "0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-8px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {/* IMAGEM */}
            {product.name === "Aparelho Digital" ? (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <img
                  src={product.image}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "220px",
                    objectFit: "contain",
                    transition: "0.3s"
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>
            ) : (
              <img
                src={product.image}
                style={{
                  width: "100%",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            )}

            <h2 style={{ margin: "18px 0 10px 0" }}>
              {product.name}
            </h2>

            <p
              style={{
                color: "#555",
                fontSize: "14px",
                padding: "0 20px",
                minHeight: "60px"
              }}
            >
              {product.description}
            </p>

            <h3
              style={{
                color: "#0d3b26",
                margin: "15px 0",
                fontSize: "22px"
              }}
            >
              R$ {product.price.toFixed(2)}
            </h3>

            {/* BOTÕES */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                padding: "0 20px"
              }}
            >
              <a
                href={product.mpLink}
                target="_blank"
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#ffc107",
                  color: "#000",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  textAlign: "center"
                }}
              >
                Mercado Pago
              </a>

              <button
                onClick={() => addToCart(product)}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#0d3b26",
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
