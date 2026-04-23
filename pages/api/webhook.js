import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    console.log("🔔 WEBHOOK RECEBIDO:", JSON.stringify(req.body, null, 2));

    const payment = req.body;

    // ✅ Garante que é notificação de pagamento
    if (!payment || payment.type !== "payment") {
      console.log("⚠️ Evento ignorado (não é pagamento)");
      return res.status(200).json({ ok: true });
    }

    const paymentId = payment?.data?.id;

    if (!paymentId) {
      console.log("❌ paymentId não encontrado");
      return res.status(200).json({ ok: true });
    }

    // 🔥 BUSCAR DADOS DO PAGAMENTO NO MERCADO PAGO
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    console.log("💰 DETALHES PAGAMENTO:", JSON.stringify(data, null, 2));

    const status = data.status;
    const referencia = data.external_reference;

    if (!referencia) {
      console.log("❌ external_reference não encontrada");
      return res.status(200).json({ ok: true });
    }

    // 🚫 Só processa pagamento aprovado
    if (status !== "approved") {
      console.log("⏳ Pagamento ainda não aprovado:", status);
      return res.status(200).json({ ok: true });
    }

    // 🔎 BUSCAR PEDIDO
    const { data: pedido, error: erroPedido } = await supabase
      .from("pedidos")
      .select("*")
      .eq("external_reference", referencia)
      .single();

    if (erroPedido || !pedido) {
      console.log("❌ Pedido não encontrado:", referencia);
      return res.status(200).json({ ok: true });
    }

    // ✅ ATUALIZA STATUS
    const { error: erroUpdate } = await supabase
      .from("pedidos")
      .update({ status: "Pago" })
      .eq("external_reference", referencia);

    if (erroUpdate) {
      console.error("❌ Erro ao atualizar pedido:", erroUpdate);
    } else {
      console.log("✅ Pedido atualizado para PAGO");
    }

    // 🔥 ATUALIZA ESTOQUE
    const { data: produto, error: erroProduto } = await supabase
      .from("produtos")
      .select("*")
      .eq("nome", pedido.produto)
      .single();

    if (!erroProduto && produto) {
      const novoEstoque = Math.max((produto.estoque || 0) - 1, 0);

      const { error: erroEstoque } = await supabase
        .from("produtos")
        .update({ estoque: novoEstoque })
        .eq("id", produto.id);

      if (erroEstoque) {
        console.error("❌ Erro ao atualizar estoque:", erroEstoque);
      } else {
        console.log("📦 Estoque atualizado:", novoEstoque);
      }
    } else {
      console.log("⚠️ Produto não encontrado para estoque:", pedido.produto);
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("🔥 ERRO NO WEBHOOK:", error);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}