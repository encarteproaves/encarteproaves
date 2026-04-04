export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { id: 'desc' },
    })

    return Response.json(produtos)
  } catch (error) {
    console.error("ERRO REAL:", error)

    return Response.json({
      error: error.message
    })
  }
}