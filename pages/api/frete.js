import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  const { cep, produtoId } = req.body;

  try {
    // 1. Busca os dados reais (22kg, 65cm, etc.) no Supabase
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", produtoId)
      .single();

    if (error || !produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // 2. Garante valores mínimos para evitar rejeição da transportadora
    const peso = parseFloat(produto.weight) > 0 ? parseFloat(produto.weight) : 0.5;
    const largura = parseInt(produto.width) >= 11 ? parseInt(produto.width) : 11;
    const altura = parseInt(produto.height) >= 2 ? parseInt(produto.height) : 2;
    const comprimento = parseInt(produto.length) >= 11 ? parseInt(produto.length) : 11;

    // 3. Consulta ao Melhor Envio
    const response = await fetch("https://www.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "User-Agent": "EncarteProAves (suporte@encarteproaves.com.br)"
      },
      body: JSON.stringify({
        from: { postal_code: "08062670" }, // <-- COLOQUE SEU CEP DE ORIGEM AQUI (SÓ NÚMEROS)
        to: { postal_code: cep.replace(/\D/g, "") },
        products: [
          {
            id: produtoId,
            width: largura,
            height: altura,
            length: comprimento,
            weight: peso,
            insurance_value: produto.preco,
            quantity: 1
          }
        ]
      })
    });

    const data = await response.json();

    if (!Array.isArray(data)) return res.status(200).json([]);

    // 4. Formata a resposta para o site entender
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
    res.status(500).json({ error: "Erro interno no cálculo" });
  }
}