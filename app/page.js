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
      image: "/caixa.jpg"
    },
    {
      name: "Aparelho Digital",
      price: 330,
      mpLink: "https://mpago.la/1Po2ehy",
      image: "/aparelho.jpg"
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

  const total = cart.reduce((sum, item) => sum + item.price + (frete[item.name] || 0), 0);

  const calcularFrete = (productName) => {
    if (!cep) {
      alert("Informe o CEP primeiro!");
      return;
    }
    const valorFrete = 20; // Simulação de frete
    setFrete({ ...frete, [productName]: valorFrete });
  };

  return (
    <div style={{ fontFamily: "'Arial', sans-serif", background: "#f4f6f8", minHeight: "100vh" }}>

      {/* HEADER */}
      <header
        style={{
          background: "#000",
          padding: "40px 50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          fontFamily: "'Arial Black', Arial, sans-serif",
          color: "#f5d76e"
        }}
      >
        <img src="/logo.png" alt="Encarte Pro Aves" style={{ width: "250px", height: "auto" }} />

        <div
          style={{
            flex: 1,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
          }}
        >
          <span style={{ fontSize: "28px", fontWeight: "900" }}>Encarte Pro Aves</span>
          <span style={{ fontSize: "18px", fontWeight: "500", marginTop: "5px" }}>
            Tecnologia e Qualidade para o Melhor Encarte de Canto
          </span>
        </div>

        <div style={{ width: "250px" }}></div>

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
              width: "320px",
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              overflow: "hidden",
              textAlign: "center",
              paddingBottom: "20px",
              transition: "0.3s"
            }}
          >
            <img src={product.image} style={{ width: "100%", borderRadius: "15px 15px 0 0" }} />
            <h2 style={{ margin: "15px 0" }}>{product.name}</h2>
            <h3 style={{ color: "#0d3b26", marginBottom: "10px" }}>R$ {product.price.toFixed(2)}</h3>

            {/* Frete */}
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                style={{
                  padding: "8px",
                  width: "70%",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "5px"
                }}
              />
              <button
                onClick={() => calcularFrete(product.name)}
                style={{
                  padding: "8px 12px",
                  marginLeft: "5px",
                  backgroundColor: "#0d3b26",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Calcular
              </button>
              {frete[product.name] !== undefined && (
                <div style={{ marginTop: "5px", fontWeight: "bold" }}>
                  Frete: R$ {frete[product.name].toFixed(2)}
                </div>
              )}
            </div>

            {/* BOTÕES ORGANIZADOS */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px" }}>
              <a
                href={product.mpLink}
                target="_blank"
                style={{
                  flex: 1,
                  padding: "12px 0",
                  backgroundColor: "#ffc107",
                  color: "#000",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "0.2s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e6b800")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffc107")}
              >
                Pagar Mercado Pago
              </a>

              <button
                onClick={() => addToCart(product)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  backgroundColor: "#0d3b26",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.2s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#144d34")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0d3b26")}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* OVERLAY CARRINHO */}
      {openCart && (
        <div
          onClick={() => setOpenCart(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            transition: "0.3s"
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
          transition: "0.3s",
          zIndex: 1000
        }}
      >
        <h2 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>Seu Carrinho</h2>

        {cart.length === 0 && <p>Seu carrinho está vazio</p>}

        {cart.map((item, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <p style={{ margin: 0 }}>{item.name}</p>
              <p style={{ margin: 0 }}>
                R$ {(item.price + (frete[item.name] || 0)).toFixed(2)}
              </p>
            </div>
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
              href={cart[cart.length - 1].mpLink}
              target="_blank"
              style={{
                display: "block",
                marginTop: "20px",
                textAlign: "center",
                padding: "12px",
                backgroundColor: "#0d3b26",
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

      {/* BOTÃO WHATSAPP */}
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
          style={{ width: "30px", height: "30px" }}
        />
      </a>
    </div>
  );
}
