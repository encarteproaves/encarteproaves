let produtos = [
  {
    id: 1,
    nome: "Caixa Acústica Profissional",
    preco: 1500,
    descricao: "Caixa acústica para encarte de canto",
  },
  {
    id: 2,
    nome: "Aparelho Digital",
    preco: 330,
    descricao: "Programador automático de canto",
  },
  {
    id: 3,
    nome: "Pen Drive 8GB",
    preco: 150,
    descricao: "Canto personalizado",
  },
];

export async function GET() {
  return Response.json(produtos);
}

export async function POST(req) {
  const body = await req.json();

  const novoProduto = {
    id: Date.now(),
    nome: body.nome,
    preco: Number(body.preco),
    descricao: body.descricao,
  };

  produtos.push(novoProduto);

  return Response.json(novoProduto);
}