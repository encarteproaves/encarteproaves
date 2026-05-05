import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  const { cep, produtoId } = req.body;

  try {
    // Busca o produto para pegar o peso e medidas reais do banco
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", produtoId)
      .single();

    if (error || !produto) throw new Error("Produto não encontrado");

    // TRATAMENTO DOS DADOS: Garante que sejam números puros (Inteiros ou decimais com ponto)
    const pesoReal = parseFloat(produto.weight);
    const larguraReal = parseInt(produto.width);
    const alturaReal = parseInt(produto.height);
    const comprimentoReal = parseInt(produto.length);

    const response = await fetch("https://www.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "User-Agent": "EncarteProAves (suporte@encarteproaves.com.br)"
      },
      body: JSON.stringify({
        from: { postal_code: "08062670" }, // Seu CEP de origem corrigido
        to: { postal_code: cep.replace(/\D/g, "") },
        products: [
          {
            id: produto.id,
            width: larguraReal,
            height: alturaReal,
            length: comprimentoReal,
            weight: pesoReal,
            insurance_value: 50, // Valor de seguro baixo apenas para teste de cálculo
            quantity: 1
          }
        ]
      })
    });

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Erro na resposta do Melhor Envio:", data);
      return res.status(200).json([]);
    }

    // Filtra as opções e entrega para o site
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
    console.error("Erro interno:", error);
    res.status(500).json({ error: "Erro ao processar frete" });
  }
}