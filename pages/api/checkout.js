import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  try {
    const {
      nome,
      preco,
      cep,
      frete,
      canto,
    } = req.body;

    // BUSCA PRODUTO NO BANCO
    const { data: produto, error: produtoError } = await supabase
      .from("produtos")
      .select("mpLink")
      .eq("nome", nome)
      .single();

    if (produtoError || !produto?.mpLink) {
      console.error("Produto sem link Mercado Pago:", produtoError);

      return res.status(400).json({
        error: "Link de pagamento não encontrado para este produto",
      });
    }

    // SALVA PEDIDO NO BANCO
    const { error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          produto: nome,
          valor: preco,
          cep,
          frete,
          canto,
          status: "Aguardando pagamento",
        },
      ]);

    if (pedidoError) {
      console.error("Erro ao salvar pedido:", pedidoError);

      return res.status(500).json({
        error: "Erro ao salvar pedido",
      });
    }

    // RETORNA LINK DE PAGAMENTO
    return res.status(200).json({
      init_point: produto.mpLink,
    });

  } catch (error) {
    console.error("ERRO CHECKOUT:", error);

    return res.status(500).json({
      error: "Erro interno no checkout",
    });
  }
}