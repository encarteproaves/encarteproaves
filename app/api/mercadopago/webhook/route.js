export async function POST(req){

  try{

    const token = process.env.MERCADOPAGO_TOKEN

    const body = await req.json()

    console.log("Webhook recebido:", body)

    const paymentId = body.data?.id

    if(paymentId){

      const pagamento = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      const data = await pagamento.json()

      console.log("Status do pagamento:", data.status)

      if(data.status === "approved"){
        console.log("Pagamento aprovado")
      }

    }

    return Response.json({ok:true})

  }catch(err){

    console.log(err)

    return Response.json({erro:true})

  }

}

