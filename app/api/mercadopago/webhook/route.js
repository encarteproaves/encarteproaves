export async function POST(req){
  const token = process.env.MERCADOPAGO_TOKEN
  const body = await req.json()

  console.log("Webhook recebido:", body)

  return Response.json({ok:true})

}
