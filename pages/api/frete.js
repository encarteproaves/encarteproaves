import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {

    const { cep, produtoId } = req.body;

    console.log("CEP recebido:", cep);
    console.log("ProdutoId recebido:", produtoId);

    if (!cep || !produtoId) {
      return res.status(400).json({
        error: "CEP ou produtoId não enviado"
      });
    }

    // ===============================
    // BUSCAR PRODUTO NO BANCO
    // ===============================
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", produtoId)
      .single();

    if (error || !produto) {
      console.error("Erro produto:", error);
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    console.log("Produto:", produto);

    // ===============================
    // VALIDAR DADOS
    // ===============================
    const peso = Number(produto.weight || 0.3);
    const largura = Number(produto.width || 20);
    const altura = Number(produto.height || 10);
    const comprimento = Number(produto.length || 15);

    if (!peso || !largura || !altura || !comprimento) {
      return res.status(400).json({
        error: "Dimensões inválidas no produto"
      });
    }

    // ===============================
    // SIMULAÇÃO DE FRETE (FUNCIONAL)
    // ===============================
    // 👉 Aqui você pode trocar depois por Melhor Envio
    const fretes = [
      {
        name: "PAC",
        price: (peso * 10 + 8).toFixed(2),
        prazo: "5 dias"
      },
      {
        name: "SEDEX",
        price: (peso * 18 + 12).toFixed(2),
        prazo: "2 dias"
      },
      {
        name: "Transportadora",
        price: (peso * 22 + 15).toFixed(2),
        prazo: "3 dias"
      }
    ];

    return res.status(200).json(fretes);

  } catch (err) {
    console.error("Erro frete API:", err);
    return res.status(500).json({
      error: "Erro interno no cálculo de frete"
    });
  }
}