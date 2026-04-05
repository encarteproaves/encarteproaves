import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const produtos = await prisma.produto.findMany({
        orderBy: { id: 'desc' },
      })
      return res.status(200).json(produtos)
    }

    if (req.method === 'POST') {
      const { nome, preco, descricao, imagem } = req.body

      const novoProduto = await prisma.produto.create({
        data: {
          nome,
          preco: parseFloat(preco),
          descricao,
          imagem,
        },
      })

      return res.status(201).json(novoProduto)
    }

    return res.status(405).json({ error: 'Método não permitido' })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro no servidor' })
  }
}