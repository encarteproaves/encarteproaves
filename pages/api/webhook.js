import { supabase } from "../../lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmailVenda(pedido) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "romulojosepereirasilva@gmail.com",
      subject: "🛒 Nova venda no site!",
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
    console.error("❌ ERRO AO ENVIAR EMAIL:", error.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = req.body;
    console.log("🔔 WEBHOOK RECEBIDO:", body);

    if (body.type !== "payment") {
      return res.status(200).json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return res.status(200).json({ ok: true });

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    const status = data.status;
    const referencia = data.external_reference;

    if (!referencia) return res.status(200).json({ ok: true });

    const { data: pedido, error: erroPedido } = await supabase
      .from("pedidos")
      .select("*")
      .eq("external_reference", referencia)
      .maybeSingle();

    if (erroPedido || !pedido) {
      console.error("❌ Pedido não encontrado ou erro:", erroPedido);
      return res.status(200).json({ ok: true });
    }

    if (status === "approved") {
      // 1. Atualiza Status
      await supabase.from("pedidos").update({ status: "Pago" }).eq("id", pedido.id);
      
      // 2. Atualiza Estoque
      const { data: produto } = await supabase
        .from("produtos")
        .select("*")
        .eq("nome", pedido.produto)
        .maybeSingle();

      if (produto) {
        const novoEstoque = Math.max((Number(produto.estoque) || 0) - 1, 0);
        await supabase.from("produtos").update({ estoque: novoEstoque }).eq("id", produto.id);
      }

      // 3. Envia Email
      await enviarEmailVenda(pedido);

      // 4. Envia WhatsApp (CallMeBot)
      const apiKey = ""; // Deixe vazio se ainda não tiver a chave
      const phone = "+5511984309480"; 
      if (apiKey) {
        const texto = `Nova Venda: ${pedido.produto} - R$ ${pedido.valor}`;
        const urlBot = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(texto)}&apikey=${apiKey}`;
        await fetch(urlBot);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("❌ ERRO GERAL NO WEBHOOK:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}