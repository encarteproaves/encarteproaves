import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabase } from "../../lib/supabase";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  try {
    console.log("BODY RECEBIDO:", req.body);

    const {
      nome,
      nome_cliente,
      cpf,
      telefone,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      preco,
      frete,
      canto,
    } = req.body;

    // ✅ VALIDAÇÃO BÁSICA
    if (!nome || preco === undefined || preco === null) {
      return res.status(400).json({
        error: "Dados básicos obrigatórios",
      });
    }

    const externalReference = `pedido-${Date.now()}`;

    // ✅ TRATAMENTO DO FRETE (mantido igual ao seu)
    let valorFrete = 0;

    if (typeof frete === "object" && frete?.price) {
      valorFrete = Number(frete.price);
    } else if (!isNaN(Number(frete))) {
      valorFrete = Number(frete);
    }

    const valorProduto = Number(preco);

    if (isNaN(valorProduto)) {
      return res.status(400).json({
        error: "Preço inválido",
      });
    }

    const valorTotal = valorProduto + valorFrete;

    console.log("DADOS CHECKOUT:", {
      nome,
      valorProduto,
      valorFrete,
      valorTotal,
      externalReference,
    });

    // ✅ CRIA PREFERÊNCIA (SEM ALTERAR SUA LÓGICA)
    const preference = new Preference(client);

    const mpResponse = await preference.create({
      body: {
        items: [
          {
            id: externalReference,
            title: nome || "Produto",
            description: canto ? `Canto: ${canto}` : nome,
            quantity: 1,
            unit_price: valorTotal, // 🔒 MANTIDO COMO ESTAVA (funcionava antes)
            currency_id: "BRL",
          },
        ],
        external_reference: externalReference,
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

    console.log("RESPOSTA MERCADO PAGO:", mpResponse);

    // ✅ SALVA NO SUPABASE (mantido igual)
    const { error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          produto: nome,
          valor: valorTotal,

          nome_cliente: nome_cliente || null,
          telefone: telefone || null,
          cpf: cpf || null,

          cep: cep || null,
          rua: endereco || null,
          numero: numero || null,
          bairro: bairro || null,
          cidade: cidade || null,
          estado: estado || null,

          frete: valorFrete,
          canto,

          status: "Aguardando pagamento",
          external_reference: externalReference,
        },
      ]);

    if (pedidoError) {
      console.error("ERRO AO SALVAR PEDIDO:");
      console.error(JSON.stringify(pedidoError, null, 2));
    }

    return res.status(200).json({
      init_point: mpResponse.init_point,
      external_reference: externalReference,
    });

  } catch (error) {
    console.error("ERRO REAL DO CHECKOUT:");
    console.error(error);

    return res.status(500).json({
      error: error?.message || "Erro interno no checkout",
    });
  }
}