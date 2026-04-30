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

    // 🔥 SUPORTE AOS DOIS FORMATOS (ANTIGO + NOVO)
    const produto = req.body.produto || {};
    const cliente = req.body.cliente || {};

    const nome = req.body.nome || produto.nome;
    const preco = req.body.preco ?? produto.preco;
    const frete = req.body.frete;

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

    if (!nome || preco === undefined || preco === null) {
      return res.status(400).json({
        error: "Dados básicos obrigatórios",
      });
    }

    const externalReference = `pedido-${Date.now()}`;

    // 🔥 FRETE ROBUSTO (compatível com qualquer API)
    let valorFrete = 0;

    if (typeof frete === "object") {
      valorFrete = Number(frete.price || frete.cost || frete.valor || 0);
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

    console.log("VALORES:", {
      valorProduto,
      valorFrete,
      valorTotal,
    });

    // 🔥 MERCADO PAGO
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

    // 🔥 SALVA PEDIDO
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
      console.error("ERRO SUPABASE:", pedidoError);

      return res.status(500).json({
        error: "Erro ao salvar pedido",
        detalhes: pedidoError,
      });
    }

    return res.status(200).json({
      init_point: response.init_point,
      external_reference: externalReference,
    });

  } catch (error) {
    console.error("ERRO GERAL:", error);

    return res.status(500).json({
      error: "Erro interno no checkout",
    });
  }
}