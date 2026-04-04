export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
import { prisma } from '../../../../lib/prisma'

// ✅ GET (listar produtos)
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { id: 'desc' },
    })

    return Response.json(produtos)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

// ✅ POST (criar produto)
export async function POST(req) {
  try {
    const body = await req.json()

    const novoProduto = await prisma.produto.create({
      data: {
        nome: body.nome,
        preco: parseFloat(body.preco),
        descricao: body.descricao,
        imagem: body.imagem,
      },
    })

    return Response.json(novoProduto)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}