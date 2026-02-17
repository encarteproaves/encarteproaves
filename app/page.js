"use client";
import { useState } from "react";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setOpenCart(true);
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f5f5f5" }}>
      {/* HEADER */}
     <header
  style={{
    background: "#000",
    padding: "40px 50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    fontFamily: "'Arial Black', Arial, sans-serif"
  }}
>
  {/* Logo */}
  <img
    src="/logo.png"
    alt="Encarte Pro Aves"
    style={{
      width: "250px",
      height: "auto"
    }}
  />

  {/* Texto central */}
  <div
    style={{
      flex: 1,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      color: "#f5d76e",
      textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
    }}
  >
    <span style={{ fontSize: "28px", fontWeight: "900" }}>Encarte Pro Aves</span>
    <span style={{ fontSize: "18px", fontWeight: "500", marginTop: "5px" }}>
      Tecnologia e Qualidade para o Melhor Encarte de Canto
    </span>
  </div>

  {/* Espaço do lado direito */}
  <div style={{ width: "250px" }}></div>

  {/* Faixa dourada embaixo */}
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

        <div
          onClick={() => setOpenCart(true)}
          style={{ cursor: "pointer" }}
        >
          🛒 {cart.length}
        </div>
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

        {/* CAIXA */}
        <div
          style={{
            backgroundColor: "#fff",
            width: "320px",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            overflow: "hidden",
            textAlign: "center",
            paddingBottom: "20px"
          }}
        >
          <img src="/caixa.jpg" style={{ width: "100%" }} />
          <h2>Caixa Acústica</h2>
          <h3>R$ 1.500,00</h3>

          <button
            onClick={() =>
              addToCart({
                name: "Caixa Acústica",
                price: 1500,
                link: "https://mpago.la/2foFNjY"
              })
            }
            style={{
              padding: "12px 20px",
              marginTop: "10px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Adicionar ao Carrinho
          </button>
        </div>

        {/* APARELHO */}
        <div
          style={{
            backgroundColor: "#fff",
            width: "320px",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            overflow: "hidden",
            textAlign: "center",
            paddingBottom: "20px"
          }}
        >
          <img src="/aparelho.jpg" style={{ width: "100%" }} />
          <h2>Aparelho Digital</h2>
          <h3>R$ 330,00</h3>

          <button
            onClick={() =>
              addToCart({
                name: "Aparelho Digital",
                price: 330,
                link: "https://mpago.la/1Po2ehy"
              })
            }
            style={{
              padding: "12px 20px",
              marginTop: "10px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </section>

      {/* OVERLAY */}
      {openCart && (
        <div
          onClick={() => setOpenCart(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        />
      )}

      {/* CARRINHO MODAL */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: openCart ? 0 : "-400px",
          width: "350px",
          height: "100%",
          backgroundColor: "#fff",
          boxShadow: "-5px 0 15px rgba(0,0,0,0.2)",
          padding: "20px",
          transition: "0.3s"
        }}
      >
        <h2>Seu Carrinho</h2>

        {cart.length === 0 && <p>Seu carrinho está vazio</p>}

        {cart.map((item, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0"
            }}
          >
            <p>{item.name}</p>
            <p>R$ {item.price.toFixed(2)}</p>
            <button
              onClick={() => removeItem(index)}
              style={{
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Remover
            </button>
          </div>
        ))}

        {cart.length > 0 && (
          <>
            <h3 style={{ marginTop: "20px" }}>
              Total: R$ {total.toFixed(2)}
            </h3>

            <a
              href={cart[cart.length - 1].link}
              target="_blank"
              style={{
                display: "block",
                marginTop: "20px",
                textAlign: "center",
                padding: "12px",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Finalizar Compra
            </a>
          </>
        )}
      </div>

      {/* BOTÃO WHATSAPP OFICIAL */}
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
          backgroundColor: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          zIndex: 1000
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          style={{
            width: "30px",
            height: "30px"
          }}
        />
      </a>

    </div>
  );
}
