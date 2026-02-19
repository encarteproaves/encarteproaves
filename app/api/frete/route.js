export async function POST(req) {

  const body = await req.json();

  const response = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer SEU_TOKEN_AQUI"
    },
    body: JSON.stringify({
      from: { postal_code: "08062670" },
      to: { postal_code: body.cep },
      package: {
        height: 10,
        width: 20,
        length: 20,
        weight: 1
      }
    })
  });

  const data = await response.json();

  return Response.json(data);
}

