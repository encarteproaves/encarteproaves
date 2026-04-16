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
    const {
      nome,
      preco,
      cep,
      frete,
      canto,
    } = req.body;

    const externalReference = `pedido-${Date.now()}`;

    // EXTRAI PREÇO DO FRETE
    let valorFrete = 0;

    if (typeof frete === "object" && frete?.price) {
      valorFrete = Number(frete.price);
    } else if (!isNaN(Number(frete))) {
      valorFrete = Number(frete);
    }

    const valorProduto = Number(preco);
    const valorTotal = valorProduto + valorFrete;

    console.log("CHECKOUT:", {
      nome,
      valorProduto,
      valorFrete,
      valorTotal,
      cep,
      canto,
      externalReference,
    });

    // CRIA CHECKOUT DINÂMICO NO MERCADO PAGO
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: externalReference,
            title: nome,
            description: canto || nome,
            quantity: 1,
            unit_price: valorTotal,
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

    // SALVA PEDIDO
    const { error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          produto: nome,
          valor: valorTotal,
          cep,
          frete: valorFrete,
          canto,
          status: "Aguardando pagamento",
          external_reference: externalReference,
        },
      ]);

    if (pedidoError) {
      console.error("ERRO AO SALVAR PEDIDO:");
      console.error(JSON.stringify(pedidoError, null, 2));

      return res.status(500).json({
        error: "Erro ao salvar pedido",
      });
    }

    return res.status(200).json({
      init_point: response.init_point,
      external_reference: externalReference,
    });

  } catch (error) {
    console.error("ERRO CHECKOUT:");
    console.error(JSON.stringify(error, null, 2));

    return res.status(500).json({
      error: "Erro interno no checkout",
    });
  }
}