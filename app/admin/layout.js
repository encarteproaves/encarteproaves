export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      
      {/* SIDEBAR */}
      <aside style={{
        width: "240px",
        background: "#0f172a",
        color: "#fff",
        padding: "20px"
      }}>
        <h2 style={{ marginBottom: "30px" }}>⚙ Admin</h2>

        <nav>
          <a href="/admin" style={link}>Dashboard</a>
          <a href="/pedidos" style={link}>Pedidos</a>
          <a href="/admin/produtos" style={link}>Produtos</a>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <div style={{ flex: 1 }}>

        {/* TOPBAR */}
        <header style={{
          background: "#fff",
          padding: "15px",
          borderBottom: "1px solid #ddd"
        }}>
          <strong>Painel Administrativo</strong>
        </header>

        <main style={{ padding: "20px" }}>
          {children}
        </main>

      </div>
    </div>
  );
}

const link = {
  display: "block",
  color: "#fff",
  marginBottom: "15px",
  textDecoration: "none"
};
