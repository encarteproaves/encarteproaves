export async function POST(req) {

  try {

    const body = await req.json();

    const response = await fetch("https://melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer SEU_TOKEN_MELHOR_ENVIO"
      },
      body: JSON.stringify({
        from: {
          postal_code: "08062670"
        },
        to: {
          postal_code: body.cep
        },
        products: [
          {
            id: "1",
            width: body.width,
            height: body.height,
            length: body.length,
            weight: body.weight,
            insurance_value: body.price,
            quantity: 1
          }
        ]
      })
    });

    const data = await response.json();

    return Response.json(data);

  } catch (error) {

    return Response.json({
      error: "Erro ao calcular frete"
    });

  }

}

