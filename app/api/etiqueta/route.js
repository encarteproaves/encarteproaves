export async function POST(req){

  try{

    const body = await req.json();
console.log("BODY RECEBIDO:", body);
    /* 1️⃣ CRIAR ENVIO NO CARRINHO */

    const criar = await fetch(
      "https://melhorenvio.com.br/api/v2/me/cart",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json",
          "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZmEzN2NmM2ZhMGY2YzllODdhZDI1Mjg2NDQxMzljNjk2YzE5NmU0MzI2NjVmYzA5MTAxM2NmOWI0YTUwZWE2ZjU1ZThhMWE5NDQ4NjdlYjAiLCJpYXQiOjE3NzE1MjEzODMuNDY3OTQ2LCJuYmYiOjE3NzE1MjEzODMuNDY3OTQ4LCJleHAiOjE4MDMwNTczODMuNDU1OTU2LCJzdWIiOiI2YjU1ZDBhNi0wNTg0LTQ5NWEtOWZkOS1lZWQ5ZTIwMmE4YzEiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.1DlY8HNZSkZv7myICGb4oi25wsDiLqyMPLEyXbkUmubgGL-Lt5VGpCyFvDJ_kp18KJBICxOCPS3uM8DKBmuukWXRqV27ij4VPW93vY2jnsIybxpB5nHQaVXbUHaQymFXvhm1RsuRPqXfnvtYu98Bbyp5_VK-MuFNxFI1e-U9mYCL9cALXaSsY2ypxgYhGNqAMsQLl1xa0EsVtWnEcLDeHGBiU7y1c2X75ISb1IJBN4J82JdmQNnjB93X4ESulOKD5OD3HeK3kGtrnBNICY5dfjXrk3RK99cVkhhMIHwIyILXPM8zi7l_97KIDkxhfxBMmUQ-7PXxuIcgCMjUhWH8zLN-E_imudqawL6wmeyLvvhYD1ps1C-FGoachggJMEr3qay00TM1Q85TCWXfGGN-TMXaJzRFJKQQcLZGzPhULn7f6RaPOFyUpuvPerkYyKiK6qrDiHjtNs5lvraHaiceMK1jPW4PiYQSfa-jLNzwoi6-dw5SohXyluLCcnG0tcMBUXbojhqmgLf4NR7Ykd-PiyZjhlFRtYpcqCax-scBZksbCFlsCukmpOyltetZrzbLOZia3yAYxCZyCxy1l6Hi_T9vATuQBGZc886FFiVrtAG8oDnMqQWdw4JsgIz3nk1YEGJvSso6v-8ZAZilTGYL9LVOHc0jvuteFQTq94-Bz1Y"
        },
        body: JSON.stringify({
  service: body.service,

  from:{
    name:"Romulo Silva",
    phone:"11900000000",
    email:"email@email.com",
    document:"00000000000",
    address:"Rua Exemplo",
    number:"100",
    district:"Centro",
    city:"São Paulo",
    country_id:"BR",
    postal_code:"08062-670"
  },

  to:{
    postal_code: body.to.postal_code
  },

  products: [
    {
      id:"1",
      width: body.width,
      height: body.height,
      length: body.length,
      weight: body.weight,
      insurance_value: body.valor,
      quantity:1
    }
  ]
})

    const carrinho = await criar.json();

    return Response.json({
      success:true,
      carrinho:carrinho
    });

  }catch(err){

    console.log(err);

    return Response.json({
      error:"Erro ao criar carrinho"
    });

  }

}
