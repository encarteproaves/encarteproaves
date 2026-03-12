export async function POST(req){

  const body = await req.json()

  console.log("Webhook recebido:", body)

  return Response.json({ok:true})

}
