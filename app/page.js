export const metadata = {
  title: "Encarte Pro Aves - Equipamentos para Encarte de Canto",
  description: "Caixas acústicas e aparelhos profissionais para encarte de canto de pássaros. Enviamos para todo Brasil.",
};

export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f6f8" }}>

      {/* TOPO */}
      <header style={{
        background: "#0d3b26",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}>
        <h1>Encarte Pro Aves</h1>
        <p>Equipamentos profissionais para encarte de canto</p>
      </header>

      {/* PRODUTOS */}
      <main style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>

        {/* CAIXA */}
        <div style={{
          background: "white",
          padding: "20px",
          marginBottom: "30px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <img
            src="/caixa.jpg"
            style={{ width: "100%", borderRadius: "10px" }}
          />
          <h2>Caixa Acústica Profissional</h2>
          <p>MDF 15mm, vidro temperado 8mm, alto falante profissional, ideal para encarte de canto.</p>
          <h3 style={{ color: "#0d3b26" }}>R$ 1.290,00</h3>
          <a
            href="https://wa.me/5511984309480"
            style={{
              background: "#25D366",
              color: "white",
              padding: "12px",
              display: "inline-block",
              borderRadius: "5px",
              textDecoration: "none"
            }}
          >
            Comprar no WhatsApp
          </a>
        </div>

        {/* APARELHO */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <img
            src="/aparelho.jpg.jpg"
            style={{ width: "100%", borderRadius: "10px" }}
          />
          <h2>Aparelho Programador Digital</h2>
          <p>Programação automática, rádio AM/FM, USB, cartão de memória e timer inteligente.</p>
          <h3 style={{ color: "#0d3b26" }}>R$ 790,00</h3>
          <a
            href="https://wa.me/5511984309480"
            style={{
              background: "#25D366",
              color: "white",
              padding: "12px",
              display: "inline-block",
              borderRadius: "5px",
              textDecoration: "none"
            }}
          >
            Comprar no WhatsApp
          </a>
        </div>

      </main>

      {/* PIX */}
      <section style={{
        background: "white",
        padding: "30px",
        textAlign: "center",
        margin: "40px"
      }}>
        <h2>Pagamento via PIX</h2>
        <p>Chave PIX:</p>
        <h3>13179423889</h3>
      </section>

      {/* WHATSAPP FIXO */}
      <a
        href="https://wa.me/5511984309480"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#25D366",
          color: "white",
          padding: "15px",
          borderRadius: "50px",
          textDecoration: "none"
        }}
      >
        WhatsApp
      </a>

      {/* RODAPÉ */}
      <footer style={{
        background: "#0d3b26",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}>
        © 2026 Encarte Pro Aves
      </footer>

    </div>
  );
}


