"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("/api/pedido")
      .then(res => res.json())
      .then(data => setPedidos(data));
  }, []);

  const total = pedidos.length;
  const enviados = pedidos.filter(p => p.status === "Enviado").length;
  const entregues = pedidos.filter(p => p.status === "Entregue").length;

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        <Card title="Pedidos" value={total} />
        <Card title="Enviados" value={enviados} />
        <Card title="Entregues" value={entregues} />

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "24px" }}>{value}</p>
    </div>
  );
}
