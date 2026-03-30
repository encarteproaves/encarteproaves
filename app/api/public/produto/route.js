import { prisma } from '../../../../lib/prisma'

// 🌐 API pública (SEM PROTEÇÃO)
export async function GET() {
  const produtos = await prisma.produto.findMany({
    orderBy: { id: 'desc' },
  })

  return Response.json(produtos)
}