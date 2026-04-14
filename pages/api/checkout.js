import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  try {
    const { produto, canto, cep } = req.body;

    if (!produto) {
      return res.status(400).json({
        error: "Produto não enviado",
      });
    }

    const descricaoExtra = `
Produto: ${produto.nome}
${canto ? `Canto: ${canto}` : ""}
${cep ? `CEP: ${cep}` : ""}
    `;

    const preference = {
      items: [
        {
          title: produto.nome,
          description: descricaoExtra,
          quantity: 1,
          unit_price: Number(produto.preco),
          currency_id: "BRL",
        },
      ],
      back_urls: {
        success: "https://www.encarteproaves.com.br",
        failure: "https://www.encarteproaves.com.br",
        pending: "https://www.encarteproaves.com.br",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    return res.status(200).json({
      init_point: response.body.init_point,
    });

  } catch (error) {
    console.error("ERRO CHECKOUT:", error);

    return res.status(500).json({
      error: "Erro ao gerar checkout",
    });
  }
}