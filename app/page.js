export default function Home() {
  return (
    <main style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
      padding: "0",
      margin: "0"
    }}>

      {/* BANNER */}
      <section style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "60px 20px",
        textAlign: "center"
      }}>
        <h1 style={{fontSize: "40px", marginBottom: "10px"}}>
          Encarte Pro Aves
        </h1>
        <p style={{fontSize: "18px", opacity: 0.8}}>
          Equipamentos Profissionais para Encarte de Canto
        </p>
      </section>

      {/* PRODUTOS */}
      <section style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        padding: "60px 20px",
        flexWrap: "wrap"
      }}>

        {/* CAIXA */}
        <div style={{
          backgroundColor: "#fff",
          width: "320px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          textAlign: "center"
        }}>
          <img src="/caixa.jpg" alt="Caixa Acústica" style={{width: "100%"}} />
          <div style={{padding: "20px"}}>
            <h2>Caixa Acústica Profissional</h2>
            <p>MDF 15mm • Vidro 8mm Temperado • Alto rendimento</p>
            <h3 style={{color: "#00a859", fontSize: "24px"}}>
              R$ 1.500,00
            </h3>
            <a
              href="https://wa.me/55SEUNUMERO"
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: "15px",
                padding: "12px 25px",
                backgroundColor: "#00a859",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "bold"
              }}
            >
              Comprar pelo WhatsApp
            </a>
          </div>
        </div>

        {/* APARELHO */}
        <div style={{
          backgroundColor: "#fff",
          width: "320px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          textAlign: "center"
        }}>
          <img src="/aparelho.jpg" alt="Aparelho Digital" style={{width: "100%"}} />
          <div style={{padding: "20px"}}>
            <h2>Aparelho Digital Programável</h2>
            <p>8 programações • USB • Cartão SD • Rádio AM/FM</p>
            <h3 style={{color: "#00a859", fontSize: "24px"}}>
              R$ 330,00
            </h3>
            <a
              href="https://wa.me/5511984309480"
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: "15px",
                padding: "12px 25px",
                backgroundColor: "#00a859",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "bold"
              }}
            >
              Comprar pelo WhatsApp
            </a>
          </div>
        </div>

      </section>

      {/* RODAPÉ */}
      <footer style={{
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
        padding: "20px"
      }}>
        © 2026 Encarte Pro Aves - Todos os direitos reservados
      </footer>

    </main>
  );
}
