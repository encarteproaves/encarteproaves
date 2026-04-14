import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { nome, preco } = req.body;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: "produto-1",
            title: nome,
            description: nome,
            quantity: 1,
            unit_price: Number(preco),
            currency_id: "BRL",
            category_id: "others",
          },
        ],

        payer: {
          name: "Cliente",
          email: "cliente@email.com",
        },

        external_reference: `pedido-${Date.now()}`,

        notification_url:
          "https://www.encarteproaves.com.br/api/webhook",

        statement_descriptor: "ENCARTEPROAVES",

        back_urls: {
          success: "https://www.encarteproaves.com.br",
          failure: "https://www.encarteproaves.com.br",
          pending: "https://www.encarteproaves.com.br",
        },

        auto_return: "approved",
      },
    });

    return res.status(200).json({
      init_point: response.init_point,
    });

  } catch (error) {
    console.error(
      "ERRO CHECKOUT DETALHADO:",
      JSON.stringify(error, null, 2)
    );

    return res.status(500).json({
      error: "Erro ao gerar checkout",
    });
  }
}