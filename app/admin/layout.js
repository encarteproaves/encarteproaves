export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "#111",
        color: "#fff",
        padding: "20px"
      }}>
        <h2>Admin</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="/admin" style={{ color: "#fff" }}>Dashboard</a></li>
          <li><a href="/pedidos" style={{ color: "#fff" }}>Pedidos</a></li>
        </ul>
      </aside>

      {/* Conteúdo */}
      <main style={{ flex: 1, padding: "20px" }}>
        {children}
      </main>

    </div>
  );
}
