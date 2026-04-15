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

    console.log("DADOS RECEBIDOS CHECKOUT:", {
      nome,
      preco,
      cep,
      frete,
      canto,
    });

    // BUSCA PRODUTO NO BANCO
    const { data: produto, error: produtoError } = await supabase
      .from("produtos")
      .select("mpLink")
      .eq("nome", nome)
      .single();

    if (produtoError || !produto?.mpLink) {
      console.error("PRODUTO SEM LINK MP:");
      console.error(JSON.stringify(produtoError, null, 2));

      return res.status(400).json({
        error: "Link de pagamento não encontrado para este produto",
      });
    }

    // SALVA PEDIDO NO BANCO
    const { data: pedidoSalvo, error: pedidoError } = await supabase
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
      ])
      .select()
      .single();

    if (pedidoError) {
      console.error("ERRO COMPLETO AO SALVAR PEDIDO:");
      console.error(JSON.stringify(pedidoError, null, 2));

      return res.status(500).json({
        error: "Erro ao salvar pedido",
        details: pedidoError,
      });
    }

    console.log("PEDIDO SALVO COM SUCESSO:");
    console.log(JSON.stringify(pedidoSalvo, null, 2));

    return res.status(200).json({
      init_point: produto.mpLink,
    });

  } catch (error) {
    console.error("ERRO GERAL CHECKOUT:");
    console.error(JSON.stringify(error, null, 2));

    return res.status(500).json({
      error: "Erro interno no checkout",
    });
  }
}