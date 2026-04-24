import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    console.log("🔔 WEBHOOK RECEBIDO:", req.body);

    const body = req.body;

    // ⚠️ Mercado Pago envia vários tipos de evento
    if (body.type !== "payment") {
      console.log("⚠️ Evento ignorado (não é pagamento)");
      return res.status(200).json({ ok: true });
    }

    const paymentId = body.data?.id;

    if (!paymentId) {
      console.error("❌ paymentId não recebido");
      return res.status(200).json({ ok: true });
    }

    // 🔥 BUSCAR PAGAMENTO NO MERCADO PAGO
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    console.log("💰 DETALHES PAGAMENTO:", data);

    const status = data.status;
    const referencia = data.external_reference;

    if (!referencia) {
      console.error("❌ external_reference NÃO VEIO");
      return res.status(200).json({ ok: true });
    }

    console.log("🔎 REFERENCIA:", referencia);

    // 🔎 BUSCAR PEDIDO
    const { data: pedido, error: erroPedido } = await supabase
      .from("pedidos")
      .select("*")
      .eq("external_reference", referencia)
      .maybeSingle();

    if (erroPedido || !pedido) {
      console.error("❌ Pedido não encontrado:", erroPedido);
      return res.status(200).json({ ok: true });
    }

    console.log("📦 PEDIDO:", pedido.id);

    if (status !== "approved") {
      console.log("⏳ Pagamento ainda não aprovado:", status);
      return res.status(200).json({ ok: true });
    }

    // ✅ ATUALIZA PEDIDO
    await supabase
      .from("pedidos")
      .update({ status: "Pago" })
      .eq("id", pedido.id);

    console.log("✅ Pedido atualizado");

    // 🔥 PRODUTO
    const { data: produto } = await supabase
      .from("produtos")
      .select("*")
      .eq("nome", pedido.produto)
      .maybeSingle();

    if (produto) {
      const novoEstoque = Math.max((produto.estoque || 0) - 1, 0);

      await supabase
        .from("produtos")
        .update({ estoque: novoEstoque })
        .eq("id", produto.id);

      console.log("📉 Estoque atualizado:", novoEstoque);
    }

    // ==============================
    // 📲 ENVIO WHATSAPP
    // ==============================
    try {
      console.log("📲 Enviando WhatsApp...");

      // 🔒 LIMPEZA DAS VARIÁVEIS
      const instance = process.env.ZAPI_INSTANCE_ID?.trim();
      const token = process.env.ZAPI_TOKEN?.trim();
      const phone = process.env.ZAPI_PHONE?.trim();

      // 🧪 DEBUG REAL
      console.log("📌 INSTANCE:", instance);
      console.log("📌 TOKEN:", token);
      console.log("📌 PHONE:", phone);

      // 🔥 MODO TESTE (DESCOMENTE SE QUISER TESTAR DIRETO)
      /*
      const instance = "3F20E67AE00542FF75B19E024201EAF7";
      const token = "5A6EE9F51F3DF83F68804F9D";
      const phone = "5511984309480";
      */

      const mensagem = `🛒 *NOVO PEDIDO PAGO*

👤 Cliente: ${pedido.nome_cliente}
📞 Telefone: ${pedido.telefone}
📦 Produto: ${pedido.produto}
💰 Valor: R$ ${pedido.valor}
🚚 Frete: R$ ${pedido.frete}

📍 Endereço:
${pedido.rua}, ${pedido.numero}
${pedido.bairro} - ${pedido.cidade}/${pedido.estado}
CEP: ${pedido.cep}`;

      const url = `https://api.z-api.io/instances/${instance}/token/${token}/send-text`;

      console.log("🌐 URL FINAL:", url);

      const zapResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          message: mensagem,
        }),
      });

      const zapData = await zapResponse.json();

      console.log("📲 RESPOSTA ZAPI:", zapData);

    } catch (err) {
      console.error("❌ ERRO WHATSAPP:", err);
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("❌ ERRO GERAL:", error);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}