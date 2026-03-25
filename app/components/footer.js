export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "#111",
      color: "#fff",
      padding: "40px 20px",
      marginTop: "50px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "30px"
      }}>
        
        {/* LOGO / NOME */}
        <div>
          <h2 style={{ marginBottom: "10px" }}>Encarteproaves</h2>
          <p style={{ color: "#aaa" }}>
            Tecnologia e Qualidade Para o Melhor Encarte de Canto.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3>Links</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><a href="/" style={link}>Início</a></li>
            <li><a href="/produtos" style={link}>Produtos</a></li>
            <li><a href="/admin/produtos" style={link}>Admin</a></li>
          </ul>
        </div>

        {/* CONTATO */}
        <div>
          <h3>Contato</h3>
          <p style={{ color: "#aaa" }}>WhatsApp: (11) 98430-9480</p>
          <p style={{ color: "#aaa" }}>Email: contato@aves.com</p>
        </div>
      </div>

      {/* LINHA FINAL */}
      <div style={{
        borderTop: "1px solid #333",
        marginTop: "30px",
        paddingTop: "15px",
        textAlign: "center",
        color: "#aaa"
      }}>
        © {new Date().getFullYear()} Encarteproaves - Todos os direitos reservados
      </div>
    </footer>
  );
}

const link = {
  color: "#aaa",
  textDecoration: "none",
  display: "block",
  marginTop: "5px"
};