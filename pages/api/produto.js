// ===============================
// IMPORTAÇÃO DO SUPABASE
// ===============================

// Cliente de conexão com o banco
import { supabase } from "../../lib/supabase";


// ===============================
// FUNÇÃO PRINCIPAL (API PRODUTO)
// ===============================
export default async function handler(req, res) {

  try {

    // ===============================
    // CAPTURA DO ID DA URL
    // ===============================
    const { id } = req.query;
    // Exemplo: /api/produto?id=123
    // ===============================
    // FIM CAPTURA ID
    // ===============================


    // ===============================
    // VALIDAÇÃO DO ID
    // ===============================
    if (!id) {
      return res.status(400).json({
        error: "ID não informado"
      });
    }
    // ===============================
    // FIM VALIDAÇÃO
    // ===============================


    // ===============================
    // BUSCA PRODUTO NO BANCO
    // ===============================
    const { data, error } = await supabase
      .from("produtos") // tabela de produtos
      .select("*") // pega todos os campos
      .eq("id", id) // filtra pelo ID
      .single(); // retorna apenas um registro
    // ===============================
    // FIM BUSCA
    // ===============================


    // ===============================
    // TRATAMENTO DE ERRO
    // ===============================
    if (error) {
      console.error("Erro ao buscar produto:", error);

      return res.status(404).json({
        error: "Produto não encontrado"
      });
    }
    // ===============================
    // FIM ERRO
    // ===============================


    // ===============================
    // RETORNO DE SUCESSO
    // ===============================
    return res.status(200).json(data);
    // ===============================
    // FIM RETORNO
    // ===============================


  } catch (err) {

    // ===============================
    // ERRO GERAL (EXCEÇÃO)
    // ===============================
    console.error("Erro geral:", err);

    return res.status(500).json({
      error: "Erro interno"
    });
    // ===============================
    // FIM ERRO GERAL
    // ===============================

  }
}
// ===============================
// FIM DO HANDLER
// ===============================