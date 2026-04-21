import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    console.log("WEBHOOK RECEBIDO:", req.body);

    const payment = req.body;

    // 🔒 valida se veio pagamento aprovado
    if (payment.type !== "payment") {
      return res.status(200).json({ ok: true });
    }

    const paymentId = payment.data.id;

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

    console.log("PAGAMENTO DETALHES:", data);

    const status = data.status;
    const referencia = data.external_reference;

    // 🚫 só continua se pagamento aprovado
    if (status !== "approved") {
      return res.status(200).json({ ok: true });
    }

    // 🔎 BUSCAR PEDIDO NO BANCO
    const { data: pedido, error: erroPedido } = await supabase
      .from("pedidos")
      .select("*")
      .eq("external_reference", referencia)
      .single();

    if (erroPedido || !pedido) {
      console.error("Pedido não encontrado");
      return res.status(200).json({ ok: true });
    }

    // ✅ ATUALIZAR STATUS PARA PAGO
    await supabase
      .from("pedidos")
      .update({ status: "Pago" })
      .eq("external_reference", referencia);

    // 🔥 DIMINUIR ESTOQUE (USANDO NOME DO PRODUTO)
    const { data: produto, error: erroProduto } = await supabase
      .from("produtos")
      .select("*")
      .eq("nome", pedido.produto)
      .single();

    if (!erroProduto && produto) {
      const novoEstoque = Math.max((produto.estoque || 0) - 1, 0);

      await supabase
        .from("produtos")
        .update({ estoque: novoEstoque })
        .eq("id", produto.id);

      console.log("ESTOQUE ATUALIZADO:", novoEstoque);
    } else {
      console.error("Produto não encontrado para baixar estoque");
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("ERRO NO WEBHOOK:", error);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}