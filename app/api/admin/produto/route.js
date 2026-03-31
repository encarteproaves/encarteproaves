export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma } from '../../../../lib/prisma';

// 🔐 função de proteção
function verificarAuth(request) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.includes("admin-auth=true");
}

// 📦 GET → listar produtos
export async function GET(request) {
  try {
    if (!verificarAuth(request)) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const produtos = await prisma.produto.findMany({
      orderBy: { id: "desc" },
    });

    return Response.json(produtos);
  } catch (error) {
    console.error("ERRO GET:", error);
    return Response.json({ error: "Erro no servidor" }, { status: 500 });
  }
}

// ➕ POST → criar produto
export async function POST(request) {
  try {
    if (!verificarAuth(request)) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        preco: body.preco,
        descricao: body.descricao,
        imagem: body.imagem,
      },
    });

    return Response.json(produto);
  } catch (error) {
    console.error("ERRO POST:", error);
    return Response.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}

// ❌ DELETE → excluir produto
export async function DELETE(request) {
  try {
    if (!verificarAuth(request)) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    await prisma.produto.delete({
      where: { id: body.id },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("ERRO DELETE:", error);
    return Response.json({ error: "Erro ao excluir produto" }, { status: 500 });
  }
}