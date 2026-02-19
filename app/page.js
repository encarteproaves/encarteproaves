"use client";
import { useState } from "react";

export default function Home() {

  const products = [
    {
      name: "Caixa Acústica profissional para encarte de canto",
      description: "Caixa acústica profissional para encarte de canto em pássaros nas medidas 65x65x35 cm, resitente e com excelente propagação sonora.",
      price: 1500,
      image: "/caixa-nova.png",
      mpLink: "https://mpago.la/2foFNjY"
    },
    {
      name: "Aparelho Digital para encarte de canto",
      description: "Aparelho digital com programações automáticas para manter o treino do canto com regularidade.",
      price: 330,
      image: "/aparelho-novo.jpg",
      mpLink: "https://mpago.la/1Po2ehy"
    },
    {
      name: "Pen Drive 8GB",
      description: "Pen drive com canto editado conforme pedido do cliente",
      price: 150,
      image: "/pendrive.jpg",
      mpLink: "https://wa.me/5511984309480"
    }
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
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
          alt="Encarte Pro Aves"
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

        {/* LINHA DOURADA */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background: "linear-gradient(90deg, #c9a227, #f5d76e, #c9a227)"
          }}
        />
      </header>


      {/* PRODUTOS */}
      <section
        style={{
          padding: "50px 20px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap"
        }}
      >

        {products.map((product, index) => (

          <div
            key={index}
            style={{
              width: "320px",
              background: "#fff",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              textAlign: "center",
              paddingBottom: "20px"
            }}
          >

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
                  objectFit: product.name === "Aparelho Digital" ? "contain" : "cover"
                }}
              />
            </div>

            <h2>{product.name}</h2>
            <p style={{ padding: "0 15px", color: "#555" }}>
              {product.description}
            </p>

            <h3 style={{ marginTop: "10px" }}>
              R$ {product.price.toFixed(2)}
            </h3>

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
                  marginTop: "10px",
                  fontWeight: "bold"
                }}
              >
                Comprar Agora
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


      {/* WHATSAPP FLUTUANTE */}
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
