// ===============================
// IMPORTAÇÃO DO SUPABASE
// ===============================

// Cliente do banco de dados
import { supabase } from "../../lib/supabase";


// ===============================
// FUNÇÃO PRINCIPAL (API PEDIDOS)
// ===============================
export default async function handler(req, res) {


  // ===============================
  // MÉTODO POST (CRIAR PEDIDO)
  // ===============================
  if (req.method === "POST") {

    try {

      // ===============================
      // DADOS RECEBIDOS DO FRONTEND
      // ===============================
      const { produto, valor, cep, frete, canto } = req.body;
      // ===============================
      // FIM CAPTURA DADOS
      // ===============================


      // ===============================
      // INSERIR PEDIDO NO BANCO
      // ===============================
      const { data, error } = await supabase
        .from("pedidos")
        .insert([
          {
            produto, // nome do produto
            valor, // valor total
            cep, // CEP do cliente
            frete, // valor do frete
            canto, // campo opcional (tipo canto do pássaro)

            status: "Aguardando pagamento", // status inicial
          },
        ])
        .select() // retorna o registro inserido
        .single(); // garante retorno de apenas 1 item
      // ===============================
      // FIM INSERT
      // ===============================


      // ===============================
      // TRATAMENTO DE ERRO DO BANCO
      // ===============================
      if (error) {
        console.error("ERRO AO SALVAR PEDIDO:", error);

        return res.status(500).json({
          error: "Erro ao salvar pedido",
        });
      }
      // ===============================
      // FIM ERRO
      // ===============================


      // ===============================
      // RESPOSTA DE SUCESSO
      // ===============================
      return res.status(200).json(data);
      // ===============================
      // FIM RESPOSTA
      // ===============================


    } catch (err) {

      // ===============================
      // ERRO INTERNO (EXCEÇÃO)
      // ===============================
      console.error("ERRO INTERNO:", err);

      return res.status(500).json({
        error: "Erro interno",
      });
      // ===============================
      // FIM ERRO INTERNO
      // ===============================

    }
  }
  // ===============================
  // FIM MÉTODO POST
  // ===============================



  // ===============================
  // MÉTODO GET (LISTAR PEDIDOS)
  // ===============================
  if (req.method === "GET") {

    // Busca todos os pedidos no banco
    const { data, error } = await supabase
      .from("pedidos")
      .select("*") // traz todos os campos
      .order("created_at", { ascending: false }); // mais recentes primeiro
    // ===============================
    // FIM SELECT
    // ===============================


    // ===============================
    // TRATAMENTO DE ERRO
    // ===============================
    if (error) {
      console.error(error);

      return res.status(500).json([]);
    }
    // ===============================
    // FIM ERRO
    // ===============================


    // ===============================
    // RETORNO DOS PEDIDOS
    // ===============================
    return res.status(200).json(data);
    // ===============================
    // FIM RETORNO
    // ===============================
  }
  // ===============================
  // FIM MÉTODO GET
  // ===============================



  // ===============================
  // MÉTODO NÃO PERMITIDO
  // ===============================
  return res.status(405).json({
    error: "Método não permitido",
  });
  // ===============================
  // FIM MÉTODO NÃO PERMITIDO
  // ===============================
}
// ===============================
// FIM DO HANDLER
// ===============================