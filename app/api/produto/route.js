import { prisma } from '../../../lib/prisma'

// 🔐 função de proteção
function verificarAuth(request) {
  const cookie = request.headers.get('cookie') || ''
  return cookie.includes('admin-auth=true')
}

// 📦 GET → listar produtos
export async function GET(request) {
  if (!verificarAuth(request)) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const produtos = await prisma.produto.findMany({
    orderBy: { id: 'desc' },
  })

  return Response.json(produtos)
}

// ➕ POST → criar produto
export async function POST(request) {
  if (!verificarAuth(request)) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  const produto = await prisma.produto.create({
    data: {
      nome: body.nome,
      preco: body.preco,
      descricao: body.descricao,
      imagem: body.imagem,
    },
  })

  return Response.json(produto)
}

// ❌ DELETE → excluir produto
export async function DELETE(request) {
  if (!verificarAuth(request)) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  await prisma.produto.delete({
    where: { id: body.id },
  })

  return Response.json({ ok: true })
}