// ===============================
// IMPORTAÇÕES
// ===============================

// Hooks do React (estado e efeitos)
import { useEffect, useState } from "react";


// ===============================
// COMPONENTE PAINEL DE PEDIDOS
// ===============================
export default function PainelPedidos() {

  // ===============================
  // ESTADOS
  // ===============================
  const [pedidos, setPedidos] = useState([]); // Lista de pedidos
  const [loading, setLoading] = useState(true); // Controle de carregamento
  // ===============================
  // FIM ESTADOS
  // ===============================


  // ===============================
  // CARREGA PEDIDOS AO ABRIR A PÁGINA
  // ===============================
  useEffect(() => {
    carregarPedidos();
  }, []);
  // ===============================
  // FIM USEEFFECT
  // ===============================


  // ===============================
  // FUNÇÃO PARA BUSCAR PEDIDOS
  // ===============================
  const carregarPedidos = async () => {
    try {

      // Chamada para API de pedidos
      const res = await fetch("/api/pedidos");

      // Valida resposta
      if (!res.ok) {
        throw new Error("Erro ao buscar pedidos");
      }

      const data = await res.json();

      // Garante que sempre será array
      setPedidos(Array.isArray(data) ? data : []);

    } catch (error) {

      // Erro ao buscar pedidos
      console.error("Erro ao carregar pedidos:", error);

      setPedidos([]);

    } finally {

      // Finaliza loading
      setLoading(false);
    }
  };
  // ===============================
  // FIM FUNÇÃO CARREGAR
  // ===============================


  // ===============================
  // MARCAR PEDIDO COMO ENVIADO
  // ===============================
  const marcarComoEnviado = async (id) => {

    // Confirmação do usuário
    const confirmar = confirm("Marcar como enviado?");
    if (!confirmar) return;

    try {

      // Chamada para API de atualização
      const res = await fetch("/api/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // Envia ID e novo status
        body: JSON.stringify({
          id,
          status: "Enviado",
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar");
      }


      // ===============================
      // ATUALIZA NA TELA SEM RECARREGAR
      // ===============================
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: "Enviado" }
            : p
        )
      );
      // ===============================
      // FIM ATUALIZAÇÃO
      // ===============================


      alert("Pedido marcado como enviado!");

    } catch (error) {

      // Erro ao atualizar
      console.error(error);
      alert("Erro ao atualizar pedido");
    }
  };
  // ===============================
  // FIM FUNÇÃO MARCAR
  // ===============================


  // ===============================
  // TELA DE LOADING
  // ===============================
  if (loading) {
    return <p style={{ padding: 20 }}>Carregando pedidos...</p>;
  }
  // ===============================
  // FIM LOADING
  // ===============================


  // ===============================
  // RENDER PRINCIPAL
  // ===============================
  return (

    <div style={{ padding: 20 }}>

      {/* TÍTULO */}
      <h1>Painel de Pedidos</h1>


      {/* CASO NÃO TENHA PEDIDOS */}
      {pedidos.length === 0 && (
        <p>Nenhum pedido encontrado</p>
      )}


      {/* LISTA DE PEDIDOS */}
      {pedidos.map((p) => (

        // ===============================
        // CARD DO PEDIDO
        // ===============================
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
          }}
        >

          {/* STATUS */}
          <p><strong>Status:</strong> {p.status || "-"}</p>

          {/* REFERÊNCIA DO PEDIDO */}
          <p><strong>Pedido:</strong> {p.external_reference || "-"}</p>


          {/* DADOS DO CLIENTE */}
          <p><strong>Cliente:</strong> {p.nome_cliente || "-"}</p>
          <p><strong>Telefone:</strong> {p.telefone || "-"}</p>
          <p><strong>CPF:</strong> {p.cpf || "-"}</p>


          {/* ENDEREÇO */}
          <p>
            <strong>Endereço:</strong><br />
            {p.rua || "-"}, {p.numero || "-"} <br />
            {p.bairro || "-"} <br />
            {p.cidade || "-"} - {p.estado || "-"} <br />
            CEP: {p.cep || "-"}
          </p>


          {/* PRODUTO E VALORES */}
          <p><strong>Produto:</strong> {p.produto || "-"}</p>
          <p><strong>Valor:</strong> R$ {p.valor || 0}</p>
          <p><strong>Frete:</strong> R$ {p.frete || 0}</p>


          {/* ===============================
              BOTÃO MARCAR COMO ENVIADO
             =============================== */}
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
          {/* ===============================
              FIM BOTÃO
             =============================== */}

        </div>
        // ===============================
        // FIM CARD PEDIDO
        // ===============================

      ))}

    </div>
  );
  // ===============================
  // FIM RENDER
  // ===============================
}
// ===============================
// FIM COMPONENTE
// ===============================