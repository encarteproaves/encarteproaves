// ===============================
// IMPORTAÇÕES
// ===============================

// Cliente do banco Supabase
import { supabase } from "../../lib/supabase";

// Biblioteca de envio de email
import { Resend } from "resend";


// ===============================
// CONFIGURAÇÃO DO RESEND (EMAIL)
// ===============================
const resend = new Resend(process.env.RESEND_API_KEY);
// ===============================
// FIM CONFIG EMAIL
// ===============================



// ===============================
// FUNÇÃO PARA ENVIAR EMAIL DE VENDA
// ===============================
async function enviarEmailVenda(pedido) {
  try {

    // Envia email com dados do pedido
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "romulojosepereirasilva@gmail.com",
      subject: "🛒 Nova venda no site!",

      // HTML do email
      html: `
        <h2>Nova Venda 🚀</h2>
        <p><strong>Cliente:</strong> ${pedido?.nome_cliente || "N/A"}</p>
        <p><strong>Telefone:</strong> ${pedido?.telefone || "N/A"}</p>
        <p><strong>Produto:</strong> ${pedido?.produto || "N/A"}</p>
        <p><strong>Valor:</strong> R$ ${pedido?.valor || "0"}</p>
        <p><strong>Frete:</strong> R$ ${pedido?.frete || "0"}</p>

        <h3>Endereço:</h3>
        <p>
          ${pedido?.rua || ""}, ${pedido?.numero || ""}<br/>
          ${pedido?.bairro || ""} - ${pedido?.cidade || ""}/${pedido?.estado || ""}<br/>
          CEP: ${pedido?.cep || ""}
        </p>
      `,
    });

    console.log("📩 Email enviado com sucesso");

  } catch (error) {

    // Erro no envio de email
    console.error("❌ ERRO AO ENVIAR EMAIL:", error.message);
  }
}
// ===============================
// FIM FUNÇÃO EMAIL
// ===============================



// ===============================
// FUNÇÃO PRINCIPAL (WEBHOOK)
// ===============================
export default async function handler(req, res) {

  try {

    // ===============================
    // LOG DO WEBHOOK RECEBIDO
    // ===============================
    console.log("🔔 WEBHOOK RECEBIDO:", req.body);


    const body = req.body;


    // ===============================
    // FILTRO DE EVENTO (APENAS PAYMENT)
    // ===============================
    if (body.type !== "payment") {
      console.log("⚠️ Evento ignorado (não é pagamento)");
      return res.status(200).json({ ok: true });
    }
    // ===============================
    // FIM FILTRO
    // ===============================


    // ===============================
    // CAPTURA DO PAYMENT ID
    // ===============================
    const paymentId = body.data?.id;

    if (!paymentId) {
      console.error("❌ paymentId não recebido");
      return res.status(200).json({ ok: true });
    }
    // ===============================
    // FIM CAPTURA ID
    // ===============================


    // ===============================
    // CONSULTA PAGAMENTO NO MERCADO PAGO
    // ===============================
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    // ===============================
    // FIM CONSULTA
    // ===============================


    // ===============================
    // LOG DOS DETALHES DO PAGAMENTO
    // ===============================
    console.log("💰 DETALHES PAGAMENTO:", data);


    const status = data.status;
    const referencia = data.external_reference;


    // ===============================
    // VALIDAÇÃO DA REFERÊNCIA
    // ===============================
    if (!referencia) {
      console.error("❌ external_reference NÃO VEIO");
      return res.status(200).json({ ok: true });
    }

    console.log("🔎 REFERENCIA RECEBIDA:", referencia);
    // ===============================
    // FIM VALIDAÇÃO
    // ===============================


    // ===============================
    // BUSCAR PEDIDO NO BANCO
    // ===============================
    const { data: pedido, error: erroPedido } = await supabase
      .from("pedidos")
      .select("*")
      .eq("external_reference", referencia)
      .maybeSingle();
    // ===============================
    // FIM BUSCA PEDIDO
    // ===============================


    // ===============================
    // TRATAMENTO DE ERRO PEDIDO
    // ===============================
    if (erroPedido) {
      console.error("❌ ERRO AO BUSCAR PEDIDO:", erroPedido);
      return res.status(200).json({ ok: true });
    }

    if (!pedido) {
      console.error("❌ Pedido NÃO encontrado");
      return res.status(200).json({ ok: true });
    }

    console.log("📦 PEDIDO ENCONTRADO:", pedido.id);
    // ===============================
    // FIM TRATAMENTO
    // ===============================


    // ===============================
    // VERIFICA SE PAGAMENTO FOI APROVADO
    // ===============================
    if (status !== "approved") {
      console.log("⏳ Pagamento não aprovado:", status);
      return res.status(200).json({ ok: true });
    }
    // ===============================
    // FIM VERIFICAÇÃO
    // ===============================


    // ===============================
    // ATUALIZA STATUS DO PEDIDO
    // ===============================
    const { error: erroUpdatePedido } = await supabase
      .from("pedidos")
      .update({ status: "Pago" })
      .eq("id", pedido.id);

    if (erroUpdatePedido) {
      console.error("❌ ERRO AO ATUALIZAR PEDIDO:", erroUpdatePedido);
    } else {
      console.log("✅ Pedido atualizado para PAGO");
    }
    // ===============================
    // FIM UPDATE PEDIDO
    // ===============================


    // ===============================
    // BUSCAR PRODUTO PARA ATUALIZAR ESTOQUE
    // ===============================
    const { data: produto, error: erroProduto } = await supabase
      .from("produtos")
      .select("*")
      .eq("nome", pedido.produto)
      .maybeSingle();
    // ===============================
    // FIM BUSCA PRODUTO
    // ===============================


    if (erroProduto || !produto) {
      console.error("❌ Produto não encontrado");
      return res.status(200).json({ ok: true });
    }


    // ===============================
    // ATUALIZA ESTOQUE
    // ===============================
    const estoqueAtual = Number(produto.estoque) || 0;
    const novoEstoque = Math.max(estoqueAtual - 1, 0);

    const { error: erroEstoque } = await supabase
      .from("produtos")
      .update({ estoque: novoEstoque })
      .eq("id", produto.id);

    if (erroEstoque) {
      console.error("❌ ERRO ESTOQUE:", erroEstoque);
    } else {
      console.log("📉 Estoque atualizado:", novoEstoque);
    }
    // ===============================
    // FIM ESTOQUE
    // ===============================


    // ===============================
    // ENVIO DE EMAIL
    // ===============================
    await enviarEmailVenda(pedido);
    // ===============================
    // FIM EMAIL
    // ===============================


    // ===============================
    // ENVIO DE WHATSAPP (Z-API)
    // ===============================
    // ===============================
// ENVIO DE WHATSAPP (CALLMEBOT - GRÁTIS)
// ===============================
try {
  console.log("📲 Enviando WhatsApp Grátis...");

  const apiKey = "SUA_API_KEY_AQUI"; // Coloque a chave que recebeu do bot
  const phone = "+5511984309480"; // Seu número com DDI e DDD (ex: +55...)
  const texto = `Nova Venda: ${pedido.produto} - R$ ${pedido.valor}`;
  
  // O CallMeBot recebe os dados via URL (GET)
  const urlBot = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(texto)}&apikey=${apiKey}`;

  await fetch(urlBot);
  console.log("✅ WhatsApp enviado via CallMeBot");

} catch (err) {
  console.error("❌ ERRO WHATSAPP GRÁTIS:", err);
}

      // Monta mensagem
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

      // Envia mensagem
      const zapResponse = await fetch(
        `https://api.z-api.io/instances/${instance}/token/${token}/send-text`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone,
            message: mensagem,
          }),
        }
      );

      const zapData = await zapResponse.json();

      console.log("📲 RESPOSTA ZAPI:", zapData);

    } catch (err) {
      console.error("❌ ERRO WHATSAPP:", err);
    }
    // ===============================
    // FIM WHATSAPP
    // ===============================


    // ===============================
    // RESPOSTA FINAL
    // ===============================
    return res.status(200).json({ ok: true });
    // ===============================
    // FIM RESPOSTA
    // ===============================


  } catch (error) {

    // ===============================
    // ERRO GERAL DO WEBHOOK
    // ===============================
    console.error("❌ ERRO NO WEBHOOK:", error);

    return res.status(500).json({
      error: "Erro no webhook"
    });
    // ===============================
    // FIM ERRO
    // ===============================

  }
}
// ===============================
// FIM DO HANDLER
// ===============================