import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");
  
  // Captura o cep, produtoId e a nova variável quantidade vindos do front-end
  const { cep, produtoId, quantidade } = req.body;
  const qtdeDesejada = Number(quantidade || 1); // Garante que seja um número válido

  try {
    const { data: produto } = await supabase.from("produtos").select("*").eq("id", produtoId).single();
    if (!produto) return res.status(200).json([]);

    // CONVERSÃO FORÇADA: Garantimos que o sistema entenda os valores como números decimais
    const pesoUnitario = parseFloat(String(produto.weight).replace(',', '.'));
    const precoUnitario = parseFloat(String(produto.preco).replace(',', '.'));

    // CÁLCULO DINÂMICO MULTIPLICADO PELA QUANTIDADE
    const pesoTotal = pesoUnitario * qtdeDesejada;
    const valorSeguroTotal = precoUnitario * qtdeDesejada;

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
          id: String(produto.id || "1"), 
          width: Number(produto.width),
          height: Number(produto.height),
          length: Number(produto.length),
          weight: pesoTotal,              // <-- ATUALIZADO: Peso total combinado de todas as unidades
          insurance_value: valorSeguroTotal, // <-- ATUALIZADO: Seguro total combinado das mercadorias
          quantity: qtdeDesejada          // <-- ATUALIZADO: Quantidade de itens dinâmica
        }]
      })
    });

    const data = await response.json();

    // Se a resposta não for uma lista, algo está errado com o Token ou CEP de origem
    if (!Array.isArray(data)) {
      console.error("Resposta Inválida da API:", data);
      return res.status(200).json([]);
    }

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
    console.error("Erro interno no cálculo do frete:", error);
    res.status(200).json([]);
  }
}