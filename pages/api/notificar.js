import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    console.log("WEBHOOK RECEBIDO:", req.body);

    const payment = req.body;

    if (payment.type !== "payment") {
      return res.status(200).json({ ok: true });
    }

    const paymentId = payment.data.id;

    // 🔥 BUSCAR NO MERCADO PAGO
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    console.log("DETALHES PAGAMENTO:", data);

    const status = data.status;
    const referencia = data.external_reference;

    if (status !== "approved") {
      return res.status(200).json({ ok: true });
    }

    // 🔥 BUSCAR PEDIDO
    const { data: pedido } = await supabase
      .from("pedidos")
      .select("*")
      .eq("external_reference", referencia)
      .single();

    if (!pedido) {
      console.log("Pedido não encontrado, criando novo...");

      await supabase.from("pedidos").insert([
        {
          produto: "Produto",
          valor: data.transaction_amount,
          status: "Pago",
          external_reference: referencia,
        },
      ]);

      return res.status(200).json({ ok: true });
    }

    // ✅ ATUALIZA STATUS
    await supabase
      .from("pedidos")
      .update({ status: "Pago" })
      .eq("external_reference", referencia);

    // 🔥 BAIXAR ESTOQUE
    const { data: produto } = await supabase
      .from("produtos")
      .select("*")
      .eq("nome", pedido.produto)
      .single();

    if (produto) {
      const novoEstoque = Math.max((produto.estoque || 0) - 1, 0);

      await supabase
        .from("produtos")
        .update({ estoque: novoEstoque })
        .eq("id", produto.id);

      console.log("ESTOQUE ATUALIZADO");
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("ERRO WEBHOOK:", error);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}