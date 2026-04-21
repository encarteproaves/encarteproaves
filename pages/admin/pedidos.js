import { useEffect, useState } from "react";

export default function PainelPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const res = await fetch("/api/pedidos");

      if (!res.ok) {
        throw new Error("Erro ao buscar pedidos");
      }

      const data = await res.json();

      setPedidos(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoEnviado = async (id) => {
    const confirmar = confirm("Marcar como enviado?");
    if (!confirmar) return;

    try {
      const res = await fetch("/api/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: "Enviado",
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar");
      }

      // 🔥 Atualiza na tela sem reload
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "Enviado" } : p
        )
      );

      alert("Pedido marcado como enviado!");

    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar pedido");
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando pedidos...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel de Pedidos</h1>

      {pedidos.length === 0 && (
        <p>Nenhum pedido encontrado</p>
      )}

      {pedidos.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
          }}
        >
          <p><strong>Status:</strong> {p.status || "-"}</p>
          <p><strong>Pedido:</strong> {p.external_reference || "-"}</p>

          <p><strong>Cliente:</strong> {p.nome_cliente || "-"}</p>
          <p><strong>Telefone:</strong> {p.telefone || "-"}</p>
          <p><strong>CPF:</strong> {p.cpf || "-"}</p>

          <p>
            <strong>Endereço:</strong><br />
            {p.rua || "-"}, {p.numero || "-"} <br />
            {p.bairro || "-"} <br />
            {p.cidade || "-"} - {p.estado || "-"} <br />
            CEP: {p.cep || "-"}
          </p>

          <p><strong>Produto:</strong> {p.produto || "-"}</p>
          <p><strong>Valor:</strong> R$ {p.valor || 0}</p>
          <p><strong>Frete:</strong> R$ {p.frete || 0}</p>

          {/* 🔥 BOTÃO NOVO */}
          {p.status !== "Enviado" && (
            <button
              onClick={() => marcarComoEnviado(p.id)}
              style={{
                marginTop: 10,
                padding: "8px 12px",
                backgroundColor: "green",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Marcar como enviado
            </button>
          )}
        </div>
      ))}
    </div>
  );
}