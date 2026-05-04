// ===============================
// FUNÇÃO PRINCIPAL (API FRETE)
// ===============================
export default async function handler(req, res) {

  // ===============================
  // VALIDAÇÃO DE MÉTODO (SÓ POST)
  // ===============================
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }
  // ===============================
  // FIM VALIDAÇÃO MÉTODO
  // ===============================


  try {

    // ===============================
    // CAPTURA DO BODY ENVIADO PELO FRONT
    // ===============================
    const body = req.body;
    // Aqui vêm dados como:
    // cep, width, height, length, weight, price
    // ===============================
    // FIM CAPTURA BODY
    // ===============================


    // ===============================
    // CHAMADA PARA API MELHOR ENVIO
    // ===============================
    const response = await fetch(
      "https://melhorenvio.com.br/api/v2/me/shipment/calculate",
      {
        method: "POST",

        // ===============================
        // HEADERS DA REQUISIÇÃO
        // ===============================
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",

          // 🔥 TOKEN DE AUTENTICAÇÃO (CUIDADO!)
          "Authorization": "Bearer SEU_TOKEN_AQUI"
        },
        // ===============================
        // FIM HEADERS
        // ===============================


        // ===============================
        // CORPO DA REQUISIÇÃO
        // ===============================
        body: JSON.stringify({

          // CEP DE ORIGEM (SEU)
          from: {
            postal_code: "08062-670"
          },

          // CEP DE DESTINO (CLIENTE)
          to: {
            postal_code: body.cep
          },

          // PRODUTO PARA CÁLCULO
          products: [
            {
              id: "1",

              // DIMENSÕES DO PRODUTO
              width: body.width,
              height: body.height,
              length: body.length,
              weight: body.weight,

              // VALOR PARA SEGURO
              insurance_value: body.price,

              quantity: 1
            }
          ]
        })
        // ===============================
        // FIM BODY API
        // ===============================

      }
    );
    // ===============================
    // FIM CHAMADA MELHOR ENVIO
    // ===============================


    // ===============================
    // CONVERTE RESPOSTA EM JSON
    // ===============================
    const data = await response.json();
    // ===============================
    // FIM CONVERSÃO
    // ===============================


    // ===============================
    // RETORNA FRETES PARA O FRONTEND
    // ===============================
    return res.status(200).json(data);
    // ===============================
    // FIM RESPOSTA
    // ===============================


  } catch (error) {

    // ===============================
    // TRATAMENTO DE ERRO
    // ===============================
    console.error("Erro no cálculo de frete:", error);

    return res.status(500).json({
      error: "Erro no cálculo"
    });
    // ===============================
    // FIM ERRO
    // ===============================

  }
}
// ===============================
// FIM DO HANDLER
// ===============================