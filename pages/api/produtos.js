// ===============================
// IMPORTAÇÃO DO SUPABASE
// ===============================

// Cliente de conexão com o banco de dados
import { supabase } from "../../lib/supabase";


// ===============================
// FUNÇÃO PRINCIPAL (API PRODUTOS)
// ===============================
export default async function handler(req, res) {

  try {

    // ===============================
    // BUSCAR TODOS OS PRODUTOS
    // ===============================
    const { data, error } = await supabase
      .from("produtos") // tabela de produtos
      .select("*"); // seleciona todos os campos
    // ===============================
    // FIM BUSCA
    // ===============================


    // ===============================
    // TRATAMENTO DE ERRO
    // ===============================
    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }
    // ===============================
    // FIM ERRO
    // ===============================


    // ===============================
    // RETORNO DOS PRODUTOS
    // ===============================
    res.status(200).json(data);
    // ===============================
    // FIM RETORNO
    // ===============================


  } catch (err) {

    // ===============================
    // ERRO GERAL (EXCEÇÃO)
    // ===============================
    res.status(500).json({
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