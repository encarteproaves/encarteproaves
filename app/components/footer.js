export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0b1a2b",
        color: "#fff",
        padding: "40px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2>Encarteproaves</h2>
          <p>Tecnologia e Qualidade no Encarte de Canto de pássaros.</p>
        </div>

        <div>
          <h3>Links</h3>
          <p>Início</p>
          <p>Admin</p>
        </div>

        <div>
          <h3>Contato</h3>
          <p>📱 Falar no WhatsApp</p>
          <p>✉️ contato@encarteproaves.com.br</p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        © {new Date().getFullYear()} Encarteproaves
      </div>
    </footer>
  );
}