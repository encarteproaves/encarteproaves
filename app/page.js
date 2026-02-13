export default function Home() {
  return (
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      
      <h1 style={{ textAlign: "center", color: "#1a4d2e" }}>
        🎵 Encarte Pro Aves
      </h1>

      <p style={{ textAlign: "center", fontSize: "18px" }}>
        Especialistas em aparelhos e caixas acústicas para encarte de canto
      </p>

      <hr />

      <h2>🔊 Caixa Acústica Profissional</h2>
      <ul>
        <li>📏 Medidas: 65x65x35 cm</li>
        <li>🪵 MDF 15mm de alta resistência</li>
        <li>🪟 Porta com vidro temperado 8mm (40x40 cm)</li>
        <li>🔈 Alto falante interno de alto rendimento</li>
        <li>🎧 Entradas de áudio laterais</li>
      </ul>

      <h2>🎛️ Aparelho Programador Digital</h2>
      <ul>
        <li>⏱️ Até 8 programações de liga</li>
        <li>⏱️ Até 8 programações de desliga</li>
        <li>📻 Rádio AM/FM</li>
        <li>💾 Pen drive e cartão de memória (MP3)</li>
        <li>🔄 Programação automática: 1h toca / 30min descanso</li>
      </ul>

      <hr />

      <h2 style={{ color: "#1a4d2e" }}>📲 Fale Conosco</h2>
      <p>
        Entre em contato pelo WhatsApp para pedidos e informações.
      </p>

      <a 
        href="https://wa.me/SEUNUMEROAQUI" 
        target="_blank"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          backgroundColor: "#25D366",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          fontWeight: "bold"
        }}
      >
        💬 Chamar no WhatsApp
      </a>

    </div>
  )
}

