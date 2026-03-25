import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📥 LISTAR PRODUTOS
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { id: "desc" },
    });

    return Response.json(produtos);
  } catch (error) {
    console.error("Erro GET:", error);
    return Response.json({ error: "Erro ao buscar produtos" });
  }
}

// ➕ CRIAR PRODUTO
export async function POST(req) {
  try {
    const body = await req.json();

    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        preco: Number(body.preco),
        descricao: body.descricao,
      },
    });

    return Response.json(produto);
  } catch (error) {
    console.error("Erro POST:", error);
    return Response.json({ error: "Erro ao criar produto" });
  }
}

// ✏️ ATUALIZAR PRODUTO
export async function PUT(req) {
  try {
    const body = await req.json();

    const produto = await prisma.produto.update({
      where: {
        id: Number(body.id),
      },
      data: {
        nome: body.nome,
        preco: Number(body.preco),
        descricao: body.descricao,
      },
    });

    return Response.json(produto);
  } catch (error) {
    console.error("Erro PUT:", error);
    return Response.json({ error: "Erro ao atualizar produto" });
  }
}

// ❌ DELETAR PRODUTO
export async function DELETE(req) {
  try {
    const body = await req.json();

    await prisma.produto.delete({
      where: {
        id: Number(body.id),
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Erro DELETE:", error);
    return Response.json({ error: "Erro ao deletar produto" });
  }
}