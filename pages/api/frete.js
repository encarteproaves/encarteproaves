import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { cep, produtoId } = req.body;

  try {
    // 1. Busca os dados técnicos reais do produto no Supabase
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("weight, width, height, length")
      .eq("id", produtoId)
      .single();

    if (error || !produto) throw new Error("Produto não encontrado");

    // 2. Consulta o Melhor Envio com os dados REAIS do produto
    const response = await fetch("https://www.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "User-Agent": "EncarteProAves (contato@seusite.com)"
      },
      body: JSON.stringify({
        from: { postal_code: "08062670" }, // <--- COLOQUE SEU CEP AQUI
        to: { postal_code: cep },
        products: [
          {
            id: produtoId,
            width: produto.width,
            height: produto.height,
            length: produto.length,
            weight: produto.weight,
            insurance_value: 100,
            quantity: 1
          }
        ]
      })
    });

    const data = await response.json();

    // 3. Filtra apenas transportadoras que não deram erro
    const fretesValidos = data
      .filter(f => !f.error)
      .map(f => ({
        id: f.id,
        name: f.name,
        price: f.custom_price || f.price,
        deadline: f.delivery_range ? f.delivery_range.max : f.delivery_time
      }));

    res.status(200).json(fretesValidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao calcular frete" });
  }
}