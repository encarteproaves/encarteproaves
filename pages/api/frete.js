import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  // Validação do Método: Garante que apenas requisições POST sejam aceitas.
  if (req.method !== "POST") return res.status(405).send("Método não permitido");
  
  // Extração de Dados: Recebe o CEP de destino e o ID do produto vindos do front-end.
  const { cep, produtoId } = req.body;

  try {
    // 1. Busca no Banco de Dados: Localiza o produto no Supabase para obter medidas e peso reais.
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", produtoId)
      .single();

    // Tratamento de Erro: Interrompe se o produto não existir.
    if (error || !produto) throw new Error("Produto não encontrado");

    // 2. Limpeza e Normalização (Sanitização):
    // Converte o peso para número, tratando casos onde o banco usa vírgula (ex: "0,3" vira 0.3).
    const pesoLimpo = Number(String(produto.weight).replace(',', '.'));
    
    // Garantia de Dimensões Mínimas: Evita rejeição por transportadoras que exigem pacotes mínimos (ex: Correios).
    const larguraLimpa = Math.max(Number(produto.width), 11);
    const alturaLimpa = Math.max(Number(produto.height), 4);
    const comprimentoLimpa = Math.max(Number(produto.length), 16);

    // 3. Integração com API Melhor Envio:
    const response = await fetch("https://www.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`, // Token de segurança do servidor.
        "User-Agent": "EncarteProAves (suporte@encarteproaves.com.br)"
      },
      body: JSON.stringify({
        from: { postal_code: "08062670" }, // CEP de origem fixo do lojista.
        to: { postal_code: cep.replace(/\D/g, "") }, // Limpa o CEP de destino para conter apenas números.
        products: [{
          id: String(produto.id).substring(0, 8), // Encurta o ID para compatibilidade com a API.
          width: larguraLimpa,
          height: alturaLimpa,
          length: comprimentoLimpa,
          weight: pesoLimpo,
          // Trava de Seguro: Usa 50 como valor base para garantir que transportadoras econômicas apareçam.
          insurance_value: Number(produto.preco) > 50 ? 50 : Number(produto.preco), 
          quantity: 1
        }]
      })
    });

    const data = await response.json();

    // 4. Validação da Resposta da API:
    // Se a API retornar um objeto de erro em vez de uma lista (Array), retorna uma lista vazia para o front-end.
    if (!Array.isArray(data)) {
      console.error("Melhor Envio falhou:", data);
      return res.status(200).json([]);
    }

    // 5. Mapeamento e Formatação Final:
    // Transforma a resposta complexa da API em um objeto simples que o [id].js consegue ler.
    const fretesValidos = data
      .filter(f => !f.error) // Remove opções que a transportadora marcou com erro para aquele CEP.
      .map(f => ({
        id: f.id,
        name: f.name,
        price: parseFloat(f.custom_price || f.price), // Prioriza preços personalizados se houver.
        deadline: f.delivery_range ? f.delivery_range.max : f.delivery_time // Normaliza o prazo de entrega.
      }));

    res.status(200).json(fretesValidos);

  } catch (error) {
    // Segurança: Em caso de erro crítico no servidor, retorna lista vazia para não travar a interface do usuário.
    console.error("Erro Interno:", error);
    res.status(200).json([]);
  }
}