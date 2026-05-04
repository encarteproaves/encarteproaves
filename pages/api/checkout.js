// ===============================
// IMPORTAÇÕES
// ===============================

// SDK do Mercado Pago (configuração e criação de pagamento)
import { MercadoPagoConfig, Preference } from "mercadopago";

// Cliente do banco Supabase
import { supabase } from "../../lib/supabase";


// ===============================
// CONFIGURAÇÃO DO MERCADO PAGO
// ===============================
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Token secreto
});
// ===============================
// FIM CONFIG MERCADO PAGO
// ===============================


// ===============================
// FUNÇÃO PRINCIPAL (API ROUTE)
// ===============================
export default async function handler(req, res) {

  // ===============================
  // VALIDAÇÃO DE MÉTODO (SÓ POST)
  // ===============================
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }
  // ===============================
  // FIM VALIDAÇÃO MÉTODO
  // ===============================


  try {

    // ===============================
    // LOG DE DEBUG
    // ===============================
    console.log("BODY RECEBIDO:", req.body);


    // ===============================
    // SUPORTE A 2 FORMATOS DE ENVIO
    // (ANTIGO E NOVO FRONTEND)
    // ===============================
    const produto = req.body.produto || {};
    const cliente = req.body.cliente || {};
    // ===============================
    // FIM SUPORTE FORMATO
    // ===============================


    // ===============================
    // DADOS DO PRODUTO
    // ===============================
    const nome = req.body.nome || produto.nome;
    const preco = req.body.preco ?? produto.preco;
    const frete = req.body.frete;
    // ===============================
    // FIM DADOS PRODUTO
    // ===============================


    // ===============================
    // DADOS DO CLIENTE
    // ===============================
    const nome_cliente = req.body.nome_cliente || cliente.nome;
    const telefone = req.body.telefone || cliente.telefone;
    const cpf = req.body.cpf || cliente.cpf;

    const cep = req.body.cep || cliente.cep;
    const endereco = req.body.endereco || cliente.endereco;
    const numero = req.body.numero || cliente.numero;
    const bairro = req.body.bairro || cliente.bairro;
    const cidade = req.body.cidade || cliente.cidade;
    const estado = req.body.estado || cliente.estado;

    const canto = req.body.canto || cliente.canto;
    // ===============================
    // FIM DADOS CLIENTE
    // ===============================


    // ===============================
    // VALIDAÇÃO BÁSICA
    // ===============================
    if (!nome || preco === undefined || preco === null) {
      return res.status(400).json({
        error: "Dados básicos obrigatórios",
      });
    }
    // ===============================
    // FIM VALIDAÇÃO
    // ===============================


    // ===============================
    // GERA ID ÚNICO DO PEDIDO
    // ===============================
    const externalReference = `pedido-${Date.now()}`;
    // ===============================
    // FIM GERAÇÃO ID
    // ===============================


    // ===============================
    // TRATAMENTO DE FRETE (ROBUSTO)
    // ===============================
    let valorFrete = 0;

    // Se vier como objeto (API de frete)
    if (typeof frete === "object") {
      valorFrete = Number(frete.price || frete.cost || frete.valor || 0);

    // Se vier como número direto
    } else if (!isNaN(Number(frete))) {
      valorFrete = Number(frete);
    }
    // ===============================
    // FIM FRETE
    // ===============================


    // ===============================
    // VALORES FINAIS
    // ===============================
    const valorProduto = Number(preco);

    if (isNaN(valorProduto)) {
      return res.status(400).json({
        error: "Preço inválido",
      });
    }

    const valorTotal = valorProduto + valorFrete;
    // ===============================
    // FIM CÁLCULO
    // ===============================


    // ===============================
    // LOG DE VALORES
    // ===============================
    console.log("VALORES:", {
      valorProduto,
      valorFrete,
      valorTotal,
    });


    // ===============================
    // CRIA PAGAMENTO NO MERCADO PAGO
    // ===============================
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: externalReference, // ID interno do pedido
            title: String(nome),
            description: canto
              ? `Canto: ${canto}`
              : String(nome),
            quantity: 1,
            unit_price: valorTotal,
            currency_id: "BRL",
          },
        ],

        external_reference: externalReference, // ligação com seu sistema

        notification_url:
          "https://www.encarteproaves.com.br/api/webhook",

        back_urls: {
          success: "https://www.encarteproaves.com.br",
          failure: "https://www.encarteproaves.com.br",
          pending: "https://www.encarteproaves.com.br",
        },

        auto_return: "approved",
      },
    });
    // ===============================
    // FIM MERCADO PAGO
    // ===============================


    // ===============================
    // LOG DA PREFERENCE
    // ===============================
    console.log("PREFERENCE CRIADA:", response.id);


    // ===============================
    // SALVAR PEDIDO NO SUPABASE
    // ===============================
    const { data, error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          produto: String(nome),
          valor: Number(valorTotal),

          nome_cliente: nome_cliente || "",
          telefone: telefone || "",
          cpf: cpf || "",

          cep: cep || "",
          rua: endereco || "",
          numero: numero ? String(numero) : "",
          bairro: bairro || "",
          cidade: cidade || "",
          estado: estado || "",

          frete: Number(valorFrete) || 0,
          canto: canto || "",

          status: "Aguardando pagamento",
          external_reference: externalReference,
        },
      ])
      .select();
    // ===============================
    // FIM SALVAMENTO
    // ===============================


    // ===============================
    // TRATAMENTO DE ERRO DO BANCO
    // ===============================
    if (pedidoError) {
      console.error("ERRO SUPABASE:", pedidoError);

      return res.status(500).json({
        error: "Erro ao salvar pedido",
        detalhes: pedidoError,
      });
    }
    // ===============================
    // FIM ERRO BANCO
    // ===============================


    // ===============================
    // RESPOSTA FINAL PARA FRONTEND
    // ===============================
    return res.status(200).json({
      init_point: response.init_point, // URL do pagamento
      external_reference: externalReference,
    });
    // ===============================
    // FIM RESPOSTA
    // ===============================


  } catch (error) {

    // ===============================
    // ERRO GERAL DO SISTEMA
    // ===============================
    console.error("ERRO GERAL:", error);

    return res.status(500).json({
      error: "Erro interno no checkout",
    });
    // ===============================
    // FIM ERRO GERAL
    // ===============================

  }
}
// ===============================
// FIM DO HANDLER
// ===============================