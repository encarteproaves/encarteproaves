export async function POST(req) {

  try {

    const body = await req.json();

    const response = await fetch("https://melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOWVhNGQ1NWE5YTYzYTMwYjc3MjkzOTYwZjg4MzFhODZmZmE4OGIzNTBkMDVjMjQ1YmEyZWFlODljODg5MWYzMTAxZDc5OTQ2NDA5NmE0YzkiLCJpYXQiOjE3NzE1NTEzMjcuOTg1NjM5LCJuYmYiOjE3NzE1NTEzMjcuOTg1NjQxLCJleHAiOjE4MDMwODczMjcuOTY4Mjk0LCJzdWIiOiI2YjU1ZDBhNi0wNTg0LTQ5NWEtOWZkOS1lZWQ5ZTIwMmE4YzEiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.IhOFWzqBOFyO16FA4M0g1_USms5u2lJKckK179FBAfcdM87tViqd2v_6GUb_tw3tI7X_GQrJG0CFenbLN5-nEZuoTbB2WzjtF-0w7OQRhs1ZNRePr7O-6fzlw_ep8jAkhcu2cJEyRTOD2CzsWRFEAMpM5-mPOALWvetfieU1rOhQ9M6YFZbQONPgAxdPDUI2jTupv1XTXsCyKPch43VTuICE6-dHVhKb96YwGg6t4EPouh82ypZZhWuyVRWwpgKMnpFnMMrWpYD_3vbNkjdmghX6gnxPEoeSIe_2dab-N6g7bm36PzpUsKzBSfANYqNN7xoeZgezOP0i9s9WgpZkUCLyjuKO3N1p9Mcy4U_OmIb5-KJFn19jc_vTuVPGYX84V8NEmntZdVKXZ1ppceNISOEjamBiV6AO7HJ3HGW4qIPykZ9rP-DjXWIvrvnXCboQMyRJm6RSFQwQvWYlf26taVY-5xbcdi4tZTzWqbVQT3cgV2pU-nKQC4MSLsX7W3HPFx_aUr4pI1alSNG34-d3WeqS4Nlyy8fjdVLHDB6UZZOw51jUfBRR6aTpk_e6rMidHhSLIJj87WUrcMiPO9ma4eEXpkTWqdT7GKyxco-mlo6812vbnKZXxH1qtC5vXOf1sR5ne0pU8Cc19NPluhh6mYGy-iIXC-VJo1p1PzhvIP0"
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

