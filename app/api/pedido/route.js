let pedidos = [];

export async function POST(req){
  const body = await req.json();

  const novoPedido = {
    id: Date.now(),
    produto: body.produto,
    valor: body.valor,
    cep: body.cep,
    frete: body.frete,
    canto: body.canto || "",
    status: "Aguardando etiqueta",
    data: new Date()
  };

  pedidos.push(novoPedido);

  return Response.json(novoPedido);
}

export async function GET(){
  return Response.json(pedidos);
}
