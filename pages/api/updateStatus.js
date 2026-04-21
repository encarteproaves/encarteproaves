import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const { error } = await supabase
      .from("pedidos")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar:", error);
      return res.status(500).json({ error: "Erro ao atualizar pedido" });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Erro geral:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}