import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");
  const { cep, produtoId } = req.body;

  try {
    // Busca os dados exatos do produto que já funcionavam antes
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", produtoId)
      .single();

    if (error || !produto) throw new Error("Produto não encontrado");

    const response = await fetch("https://www.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "User-Agent": "EncarteProAves (suporte@encarteproaves.com.br)"
      },
      body: JSON.stringify({
        from: { postal_code: "08062670" },
        to: { postal_code: cep.replace(/\D/g, "") },
        products: [{
          id: String(produto.id),
          width: produto.width,
          height: produto.height,
          length: produto.length,
          weight: produto.weight, // Aqui entra o peso dinâmico (22, 1, 0.3, etc)
          insurance_value: produto.preco,
          quantity: 1
        }]
      })
    });

    const data = await response.json();
    
    if (!Array.isArray(data)) return res.status(200).json([]);

    const fretesValidos = data
      .filter(f => !f.error)
      .map(f => ({
        id: f.id,
        name: f.name,
        price: parseFloat(f.custom_price || f.price),
        deadline: f.delivery_range ? f.delivery_range.max : f.delivery_time
      }));

    res.status(200).json(fretesValidos);
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
}