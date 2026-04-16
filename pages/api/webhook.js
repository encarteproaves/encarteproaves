import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  try {
    console.log("WEBHOOK RECEBIDO:", req.body);

    const externalReference =
      req.body?.data?.external_reference ||
      req.body?.external_reference;

    if (!externalReference) {
      return res.status(200).json({
        ok: true,
        message: "Sem external_reference",
      });
    }

    const { error } = await supabase
      .from("pedidos")
      .update({
        status: "Aguardando etiqueta",
      })
      .eq("external_reference", externalReference);

    if (error) {
      console.error("Erro ao atualizar pedido:", error);

      return res.status(500).json({
        error: "Erro ao atualizar pedido",
      });
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