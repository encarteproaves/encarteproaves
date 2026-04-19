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
      cpf,
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

    // ✅ VALIDAÇÃO SEGURA (NÃO QUEBRA O CHECKOUT)
    if (!nome || !preco) {
      return res.status(400).json({
        error: "Dados básicos obrigatórios",
      });
    }

    const externalReference = `pedido-${Date.now()}`;

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
      cpf,
      valorProduto,
      valorFrete,
      valorTotal,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      canto,
      externalReference,
    });

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

    // ✅ SALVAMENTO SEGURO (MESMO SE FRONTEND NÃO ENVIAR TUDO)
    const { error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          produto: nome,
          valor: valorTotal,

          // 👇 CAMPOS DO CLIENTE (NÃO QUEBRAM SE VAZIOS)
          nome_cliente: nome || null,
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