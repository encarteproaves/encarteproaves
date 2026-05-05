import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  const { cep, produtoId } = req.body;

  try {
    // 1. Busca os dados técnicos (weight, width, height, length) no Supabase
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", produtoId)
      .single();

    if (error || !produto) {
      return res.status(404).json({ error: "Produto não encontrado no banco." });
    }

    // 2. SOLUÇÃO DEFINITIVA: Converte strings do banco para Números Decimais
    // O Melhor Envio rejeita textos ou formatos com vírgula.
    const peso = Number(String(produto.weight).replace(',', '.'));
    const largura = Math.ceil(Number(produto.width)) || 11;
    const altura = Math.ceil(Number(produto.height)) || 4;
    const comprimento = Math.ceil(Number(produto.length)) || 16;

    // 3. Chamada à API do Melhor Envio com os dados dinâmicos do produto
    const response = await fetch("https://www.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "User-Agent": "EncarteProAves (suporte@encarteproaves.com.br)"
      },
      body: JSON.stringify({
        from: { postal_code: "08062670" }, // Seu CEP de origem atualizado
        to: { postal_code: cep.replace(/\D/g, "") },
        products: [
          {
            id: produto.id,
            width: largura,
            height: altura,
            length: comprimento,
            weight: peso,
            insurance_value: 50, // Seguro fixo para garantir que todas transportadoras apareçam
            quantity: 1
          }
        ]
      })
    });

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res.status(200).json([]);
    }

    // 4. Filtra apenas serviços ativos e sem erros
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
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}