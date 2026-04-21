import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  try {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ERRO AO BUSCAR PEDIDOS:", error);
      return res.status(500).json({
        error: "Erro ao buscar pedidos",
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("ERRO GERAL:", err);

    return res.status(500).json({
      error: "Erro interno",
    });
  }
}