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
        <p>Especialistas em aparelhos e caixas acústicas para encarte de canto</p>
      </header>

      <main style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>

        {/* CAIXA ACÚSTICA */}
        <div style={{
          background: "white",
          padding: "20px",
          marginBottom: "30px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <img src="/caixa.jpg" style={{ width: "100%", borderRadius: "10px" }} />
          <h2>🔊 Caixa Acústica Profissional</h2>
          <p>
            Medidas: 65x65x35 cm<br />
            Vidro na porta: 40x40 cm de 8mm temperado<br />
            Auto falante interno de alto rendimento<br />
            Entradas de áudio nas laterais<br />
            MDF 15mm
          </p>
          <h3 style={{ color: "#0d3b26" }}>💰 R$ 1.500,00</h3>
          <a href="https://wa.me/5511984309480" style={{
              background: "#25D366",
              color: "white",
              padding: "12px",
              display: "inline-block",
              borderRadius: "5px",
              textDecoration: "none"
          }}>Comprar no WhatsApp</a>
        </div>

        {/* APARELHO */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <img src="/aparelho.jpg" style={{ width: "100%", borderRadius: "10px" }} />
          <h2>🎛️ Aparelho Programador Digital</h2>
          <p>
            Até 8 programações de liga e 8 de desliga<br />
            Toca pen drive e cartão de memória (MP3)<br />
            Rádio AM/FM<br />
            Programação pré-definida: toca 1h e descansa 30min
          </p>
          <h3 style={{ color: "#0d3b26" }}>💰 R$ 330,00</h3>
          <a href="https://wa.me/5511984309480" style={{
              background: "#25D366",
              color: "white",
              padding: "12px",
              display: "inline-block",
              borderRadius: "5px",
              textDecoration: "none"
          }}>Comprar no WhatsApp</a>
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

      {/* WhatsApp fixo */}
      <a href="https://wa.me/5511984309480" style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#25D366",
        color: "white",
        padding: "15px",
        borderRadius: "50px",
        textDecoration: "none"
      }}>WhatsApp</a>

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
