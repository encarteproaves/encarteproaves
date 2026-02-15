"use client";
import { useState } from "react";

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", margin: 0 }}>

      {/* MENU */}
      <header style={{
        backgroundColor: "#111",
        padding: "15px 40px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>Encarte Pro Aves</h2>
        <div>
          🛒 {cart.length} itens | R$ {total.toFixed(2)}
        </div>
      </header>

      {/* PRODUTOS */}
      <section style={{
        padding: "60px 20px",
        display: "flex",
        justifyContent: "center",
        gap: "50px",
        flexWrap: "wrap"
      }}>

        {/* CAIXA */}
        <div style={{
          backgroundColor: "#fff",
          width: "340px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          overflow: "hidden",
          textAlign: "center",
          paddingBottom: "20px"
        }}>
          <img src="/caixa.jpg" style={{ width: "100%" }} />
          <h2>Caixa Acústica</h2>
          <h3>R$ 1.500,00</h3>

          <button
            onClick={() =>
              addToCart({
                name: "Caixa",
                price: 1500,
                link: "https://mpago.la/2foFNjY"
              })
            }
            style={{
              padding: "12px 20px",
              margin: "10px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Adicionar ao Carrinho
          </button>

          <a
            href="https://mpago.la/2foFNjY"
            target="_blank"
            style={{
              display: "block",
              marginTop: "10px",
              color: "green",
              fontWeight: "bold"
            }}
          >
            Comprar Agora
          </a>
        </div>

        {/* APARELHO */}
        <div style={{
          backgroundColor: "#fff",
          width: "340px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          overflow: "hidden",
          textAlign: "center",
          paddingBottom: "20px"
        }}>
          <img src="/aparelho.jpg" style={{ width: "100%" }} />
          <h2>Aparelho Digital</h2>
          <h3>R$ 330,00</h3>

          <button
            onClick={() =>
              addToCart({
                name: "Aparelho",
                price: 330,
                link: "https://mpago.la/1Po2ehy"
              })
            }
            style={{
              padding: "12px 20px",
              margin: "10px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Adicionar ao Carrinho
          </button>

          <a
            href="https://mpago.la/1Po2ehy"
            target="_blank"
            style={{
              display: "block",
              marginTop: "10px",
              color: "green",
              fontWeight: "bold"
            }}
          >
            Comprar Agora
          </a>
        </div>
      </section>

      {/* FINALIZAR */}
      {cart.length > 0 && (
        <section style={{ textAlign: "center", padding: "40px" }}>
          <h2>Total: R$ {total.toFixed(2)}</h2>
          <p>Para finalizar, escolha o produto no carrinho acima e clique em Comprar Agora.</p>
        </section>
      )}

    </main>
  );
}
