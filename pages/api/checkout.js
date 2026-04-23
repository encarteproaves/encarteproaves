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

    if (!nome || preco === undefined || preco === null) {
      console.error("DADOS INVÁLIDOS");
      return res.status(400).json({
        error: "Dados básicos obrigatórios",
      });
    }

    const externalReference = `pedido-${Date.now()}`;

    // 🔥 FRETE SEGURO
    let valorFrete = 0;
    if (typeof frete === "object" && frete?.price) {
      valorFrete = Number(frete.price);
    } else if (!isNaN(Number(frete))) {
      valorFrete = Number(frete);
    }

    const valorProduto = Number(preco);

    if (isNaN(valorProduto)) {
      console.error("PREÇO INVÁLIDO");
      return res.status(400).json({
        error: "Preço inválido",
      });
    }

    const valorTotal = valorProduto + valorFrete;

    console.log("VALORES:", {
      valorProduto,
      valorFrete,
      valorTotal,
    });

    // 🔥 CRIA PAGAMENTO
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: externalReference,
            title: String(nome),
            description: canto ? `Canto: ${canto}` : String(nome),
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

    console.log("PREFERENCE CRIADA:", response.id);

    // 🔥 INSERT SUPER SEGURO
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

    if (pedidoError) {
      console.error("ERRO SUPABASE COMPLETO:");
      console.error(JSON.stringify(pedidoError, null, 2));

      return res.status(500).json({
        error: "Erro ao salvar pedido",
        detalhes: pedidoError,
      });
    }

    console.log("PEDIDO SALVO:", data);

    return res.status(200).json({
      init_point: response.init_point,
      external_reference: externalReference,
    });

  } catch (error) {
    console.error("ERRO GERAL:");
    console.error(error);

    return res.status(500).json({
      error: "Erro interno no checkout",
    });
  }
}