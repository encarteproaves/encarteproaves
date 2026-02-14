
export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>

      {/* TOPO */}
      <div style={{ backgroundColor: "#1a4d2e", color: "white", padding: "30px", textAlign: "center" }}>
        <h1>Encarte Pro Aves</h1>
        <p>Especialistas em aparelhos e caixas acústicas para encarte de canto</p>
      </div>

      {/* PRODUTOS */}
      <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>

        <div style={{ marginBottom: "50px" }}>
          <h2>🔊 Caixa Acústica Profissional</h2>
          <ul>
            <li>Medidas: 65x65x35 cm</li>
            <li>MDF 15mm</li>
            <li>Vidro temperado 8mm (40x40 cm)</li>
            <li>Alto falante de alto rendimento</li>
            <li>Entradas de áudio laterais</li>
          </ul>
          <h3 style={{ color: "#1a4d2e" }}>💰 R$ 1.290,00</h3>
        </div>

        <div>
          <h2>🎛️ Aparelho Programador Digital</h2>
          <ul>
            <li>8 programações de liga</li>
            <li>8 programações de desliga</li>
            <li>Rádio AM/FM</li>
            <li>Pen drive e cartão MP3</li>
            <li>1h toca / 30min descanso automático</li>
          </ul>
          <h3 style={{ color: "#1a4d2e" }}>💰 R$ 790,00</h3>
        </div>

      </div>

      {/* RODAPÉ */}
      <div style={{ backgroundColor: "#f2f2f2", padding: "20px", textAlign: "center" }}>
        <p>© 2026 Encarte Pro Aves - Todos os direitos reservados</p>
      </div>

      {/* BOTÃO WHATSAPP FIXO */}
      <a
        href="https://wa.me/5511984309480"
        target="_blank"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25D366",
          color: "white",
          padding: "15px 20px",
          borderRadius: "50px",
          textDecoration: "none",
          fontWeight: "bold",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
        }}
      >
        💬 WhatsApp
      </a>

    </div>
  )
}

