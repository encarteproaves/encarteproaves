import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { produto, valor, cep, frete, canto } = req.body;

      const { data, error } = await supabase
        .from("pedidos")
        .insert([
          {
            produto,
            valor,
            cep,
            frete,
            canto,
            status: "Aguardando pagamento",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("ERRO AO SALVAR PEDIDO:", error);
        return res.status(500).json({
          error: "Erro ao salvar pedido",
        });
      }

      return res.status(200).json(data);

    } catch (err) {
      console.error("ERRO INTERNO:", err);
      return res.status(500).json({
        error: "Erro interno",
      });
    }
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json([]);
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({
    error: "Método não permitido",
  });
}