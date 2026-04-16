import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  try {
    console.log("WEBHOOK RAW:", JSON.stringify(req.body, null, 2));

    const paymentId =
      req.body?.data?.id ||
      req.body?.id;

    if (!paymentId) {
      console.log("Webhook sem paymentId");

      return res.status(200).json({
        ok: true,
        message: "Sem paymentId",
      });
    }

    // CONSULTA DETALHES DO PAGAMENTO NO MP
    const pagamentoResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const pagamento = await pagamentoResponse.json();

    console.log("DADOS PAGAMENTO:", pagamento);

    const externalReference = pagamento.external_reference;
    const statusPagamento = pagamento.status;

    if (!externalReference) {
      console.log("Pagamento sem external_reference");

      return res.status(200).json({
        ok: true,
        message: "Sem external_reference",
      });
    }

    // ATUALIZA SOMENTE SE APROVADO
    if (statusPagamento === "approved") {
      const { error } = await supabase
        .from("pedidos")
        .update({
          status: "Aguardando etiqueta",
        })
        .eq("external_reference", externalReference);

      if (error) {
        console.error("Erro Supabase:", error);

        return res.status(500).json({
          error: "Erro ao atualizar pedido",
        });
      }

      console.log("Pedido atualizado com sucesso");
    }

    return res.status(200).json({
      ok: true,
    });

  } catch (error) {
    console.error("ERRO WEBHOOK:", error);

    return res.status(500).json({
      error: "Erro interno",
    });
  }
}