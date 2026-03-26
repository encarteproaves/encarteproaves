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
        {/* LOGO / TEXTO */}
        <div>
          <h2>Encarteproaves</h2>
          <p>Tecnologia e Qualidade no Encarte de Canto de pássaros.</p>
        </div>

        {/* LINKS */}
        <div>
          <h3>Links</h3>

          <a href="/" style={{ display: "block", color: "#fff" }}>
            Início
          </a>

          <a href="/admin" style={{ display: "block", color: "#fff" }}>
            Admin
          </a>
        </div>

        {/* CONTATO */}
        <div>
          <h3>Contato</h3>

          <a
            href="https://wa.me/5511984309480"
            target="_blank"
            style={{ display: "block", color: "#fff" }}
          >
            📱 Falar no WhatsApp
          </a>

          <a
  href="mailto:encarteproaves@gmail.com?subject=Contato%20pelo%20site&body=Olá,%20vim%20pelo%20site%20EncarteProAves."
  style={{ display: "block", color: "#fff" }}
>
  ✉️ encarteproaves@gmail.com
</a>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        © {new Date().getFullYear()} Encarteproaves
      </div>
    </footer>
  );
}