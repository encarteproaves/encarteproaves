import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID não informado" });
    }

    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar produto:", error);
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Erro geral:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}