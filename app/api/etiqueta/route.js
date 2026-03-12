export async function POST(req){

try{

const body = await req.json()

const token = process.env.MELHOR_ENVIO_TOKEN

/* 1️⃣ CRIAR ENVIO NO CARRINHO */

const criar = await fetch(
"https://melhorenvio.com.br/api/v2/me/cart",
{
method:"POST",
headers:{
"Accept":"application/json",
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},
body: JSON.stringify({

service: 1,

from:{
name:"Romulo Silva",
phone:"11900000000",
email:"email@email.com",
document:"00000000000",
address:"Rua Exemplo",
number:"100",
district:"Centro",
city:"São Paulo",
state_abbr:"SP",
country_id:"BR",
postal_code:"08062670"
},

to:{
name:"Cliente",
phone:"11999999999",
email:"cliente@email.com",
document:"00000000000",
address:"Rua Cliente",
number:"100",
district:"Centro",
city:"Natal",
state_abbr:"RN",
country_id:"BR",
postal_code: body.cep
},

products:[
{
id:"1",
name:"Produto vendido",
quantity:1,
width: body.width,
height: body.height,
length: body.length,
weight: body.weight,
insurance_value: body.valor
}
]

})
}
)

const envio = await criar.json()

console.log("ENVIO CRIADO:",envio)

/* 2️⃣ COMPRAR FRETE */

await fetch(
"https://melhorenvio.com.br/api/v2/me/shipment/checkout",
{
method:"POST",
headers:{
"Accept":"application/json",
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},
body: JSON.stringify({
orders:[envio.id]
})
}
)

/* 3️⃣ GERAR ETIQUETA */

await fetch(
"https://melhorenvio.com.br/api/v2/me/shipment/generate",
{
method:"POST",
headers:{
"Accept":"application/json",
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},
body: JSON.stringify({
orders:[envio.id]
})
}
)

/* 4️⃣ PEGAR PDF */

const pdf = await fetch(
"https://melhorenvio.com.br/api/v2/me/shipment/print",
{
method:"POST",
headers:{
"Accept":"application/json",
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},
body: JSON.stringify({
orders:[envio.id]
})
}
)

await pdf.json()

return Response.json({
  sucesso:true
})

}

catch(err){

console.log(err)

return Response.json({
erro:"Erro ao gerar etiqueta"
})

}

}
