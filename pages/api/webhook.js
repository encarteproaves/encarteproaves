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

    // 🚨 VALIDA REFERÊNCIA
    if (!referencia) {
      console.error("❌ external_reference NÃO VEIO DO MERCADO PAGO");
      return res.status(200).json({ ok: true });
    }

    console.log("🔎 REFERENCIA RECEBIDA:", referencia);

    // 🔎 BUSCAR PEDIDO NO BANCO
    const { data: pedido, error: erroPedido } = await supabase
      .from("pedidos")
      .select("*")
      .eq("external_reference", referencia)
      .maybeSingle();

    if (erroPedido) {
      console.error("❌ ERRO AO BUSCAR PEDIDO:", erroPedido);
      return res.status(200).json({ ok: true });
    }

    if (!pedido) {
      console.error("❌ Pedido NÃO encontrado para referencia:", referencia);
      return res.status(200).json({ ok: true });
    }

    console.log("📦 PEDIDO ENCONTRADO:", pedido.id);

    // 🚫 SE NÃO FOI APROVADO AINDA
    if (status !== "approved") {
      console.log("⏳ Pagamento ainda não aprovado:", status);
      return res.status(200).json({ ok: true });
    }

    // ✅ ATUALIZAR STATUS DO PEDIDO
    const { error: erroUpdatePedido } = await supabase
      .from("pedidos")
      .update({ status: "Pago" })
      .eq("id", pedido.id);

    if (erroUpdatePedido) {
      console.error("❌ ERRO AO ATUALIZAR PEDIDO:", erroUpdatePedido);
    } else {
      console.log("✅ Pedido atualizado para PAGO");
    }

    // 🔥 BUSCAR PRODUTO
    const { data: produto, error: erroProduto } = await supabase
      .from("produtos")
      .select("*")
      .eq("nome", pedido.produto)
      .maybeSingle();

    if (erroProduto) {
      console.error("❌ ERRO AO BUSCAR PRODUTO:", erroProduto);
      return res.status(200).json({ ok: true });
    }

    if (!produto) {
      console.error("❌ Produto NÃO encontrado:", pedido.produto);
      return res.status(200).json({ ok: true });
    }

    // 🔻 DIMINUIR ESTOQUE
    const estoqueAtual = Number(produto.estoque) || 0;
    const novoEstoque = Math.max(estoqueAtual - 1, 0);

    const { error: erroEstoque } = await supabase
      .from("produtos")
      .update({ estoque: novoEstoque })
      .eq("id", produto.id);

    if (erroEstoque) {
      console.error("❌ ERRO AO ATUALIZAR ESTOQUE:", erroEstoque);
    } else {
      console.log("📉 Estoque atualizado:", novoEstoque);
    }

    // ==============================
    // 📲 ENVIO WHATSAPP (NOVO)
    // ==============================
    try {
      console.log("📲 Enviando WhatsApp...");

      const mensagem = `
🛒 *NOVO PEDIDO PAGO*

👤 Cliente: ${pedido.nome_cliente}
📞 Telefone: ${pedido.telefone}
📦 Produto: ${pedido.produto}
💰 Valor: R$ ${pedido.valor}
🚚 Frete: R$ ${pedido.frete}

📍 Endereço:
${pedido.rua}, ${pedido.numero}
${pedido.bairro} - ${pedido.cidade}/${pedido.estado}
CEP: ${pedido.cep}
`;

      const zapResponse = await fetch(
        `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: process.env.ZAPI_PHONE,
            message: mensagem,
          }),
        }
      );

      const zapData = await zapResponse.json();

      console.log("✅ WhatsApp enviado:", zapData);

    } catch (err) {
      console.error("❌ ERRO AO ENVIAR WHATSAPP:", err);
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("❌ ERRO NO WEBHOOK:", error);
    return res.status(500).json({ error: "Erro no webhook" });
  }
}