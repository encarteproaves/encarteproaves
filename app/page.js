export default function Home() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", margin: 0 }}>

      {/* MENU */}
      <header style={{
        backgroundColor: "#111",
        padding: "15px 40px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <h2 style={{ margin: 0 }}>Encarte Pro Aves</h2>
        <a 
          href="https://wa.me/55SEUNUMERO"
          target="_blank"
          style={{
            backgroundColor: "#25D366",
            padding: "10px 18px",
            borderRadius: "6px",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          WhatsApp
        </a>
      </header>

      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #000, #333)",
        color: "#fff",
        textAlign: "center",
        padding: "100px 20px"
      }}>
        <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
          Loja Oficial Encarte Pro Aves
        </h1>
        <p style={{ fontSize: "20px", opacity: 0.8 }}>
          Equipamentos profissionais para alto desempenho
        </p>
      </section>

      {/* BENEFÍCIOS */}
      <section style={{
        display: "flex",
        justifyContent: "center",
        gap: "50px",
        padding: "40px 20px",
        backgroundColor: "#f4f4f4",
        flexWrap: "wrap"
      }}>
        <div>🚚 Enviamos para todo Brasil</div>
        <div>🔒 Compra segura</div>
        <div>⭐ Produto testado e aprovado</div>
      </section>

      {/* PRODUTOS */}
      <section style={{
        padding: "80px 20px",
        backgroundColor: "#f9f9f9",
        display: "flex",
        justifyContent: "center",
        gap: "50px",
        flexWrap: "wrap"
      }}>

        {/* CAIXA */}
        <div style={{
          backgroundColor: "#fff",
          width: "350px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          overflow: "hidden",
          transition: "0.3s"
        }}>
          <div style={{
            position: "absolute",
            backgroundColor: "red",
            color: "#fff",
            padding: "5px 10px",
            fontSize: "12px",
            borderRadius: "0 0 8px 0"
          }}>
            MAIS VENDIDO
          </div>

          <img src="/caixa.jpg" alt="Caixa Acústica" style={{ width: "100%" }} />

          <div style={{ padding: "25px" }}>
            <h2>Caixa Acústica Profissional</h2>
            <p style={{ color: "#555" }}>
              MDF 15mm • Vidro 8mm • Alto rendimento • Entradas laterais
            </p>

            <p style={{ textDecoration: "line-through", color: "#999" }}>
              R$ 1.799,00
            </p>

            <h3 style={{ fontSize: "28px", color: "#000", margin: "5px 0" }}>
              R$ 1.500,00
            </h3>

            <p style={{ color: "green", fontWeight: "bold" }}>
              ou 12x de R$ 125,00
            </p>

            <a
              href="https://wa.me/55SEUNUMERO"
              target="_blank"
              style={{
                display: "block",
                marginTop: "20px",
                textAlign: "center",
                padding: "14px",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Comprar Agora
            </a>
          </div>
        </div>

        {/* APARELHO */}
        <div style={{
          backgroundColor: "#fff",
          width: "350px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}>
          <img src="/aparelho.jpg" alt="Aparelho Digital" style={{ width: "100%" }} />

          <div style={{ padding: "25px" }}>
            <h2>Aparelho Digital Programável</h2>
            <p style={{ color: "#555" }}>
              8 programações • USB • Cartão SD • Rádio AM/FM
            </p>

            <p style={{ textDecoration: "line-through", color: "#999" }}>
              R$ 399,00
            </p>

            <h3 style={{ fontSize: "28px", color: "#000", margin: "5px 0" }}>
              R$ 330,00
            </h3>

            <p style={{ color: "green", fontWeight: "bold" }}>
              ou 6x de R$ 55,00
            </p>

            <a
              href="https://wa.me/55SEUNUMERO"
              target="_blank"
              style={{
                display: "block",
                marginTop: "20px",
                textAlign: "center",
                padding: "14px",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Comprar Agora
            </a>
          </div>
        </div>

      </section>

      {/* RODAPÉ */}
      <footer style={{
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "center",
        padding: "30px"
      }}>
        © 2026 Encarte Pro Aves - Loja Oficial
      </footer>

    </main>
  );
}
