import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("produtos")
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
}