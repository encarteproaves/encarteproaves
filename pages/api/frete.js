import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");
  
  const { cep, produtoId } = req.body;

  try {
    // 1. Busca o produto
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", produtoId)
      .single();

    if (error || !produto) throw new Error("Produto não encontrado");

    // 2. LIMPEZA TOTAL DOS DADOS (AQUI ESTÁ A SOLUÇÃO)
    // Forçamos a conversão para número puro e garantimos mínimos de segurança
    const pesoLimpo = Number(String(produto.weight).replace(',', '.'));
    const larguraLimpa = Math.max(Number(produto.width), 11);
    const alturaLimpa = Math.max(Number(produto.height), 4);
    const comprimentoLimpa = Math.max(Number(produto.length), 16);

    // 3. Chamada à API
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
          id: String(produto.id).substring(0, 8), // ID curto para evitar erro de sistema
          width: larguraLimpa,
          height: alturaLimpa,
          length: comprimentoLimpa,
          weight: pesoLimpo,
          insurance_value: Number(produto.preco) > 50 ? 50 : Number(produto.preco), // Seguro baixo para destravar cálculo
          quantity: 1
        }]
      })
    });

    const data = await response.json();

    // 4. Verificação de resposta
    if (!Array.isArray(data)) {
      console.error("Melhor Envio falhou:", data);
      return res.status(200).json([]);
    }

    // 5. Mapeamento final
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
    console.error("Erro Interno:", error);
    res.status(200).json([]);
  }
}