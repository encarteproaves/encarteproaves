import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  const { method } = req

  // 🔓 GET é público (mostrar produtos)
  if (method === 'GET') {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error })

    return res.status(200).json(data)
  }

  // 🔒 PROTEÇÃO PARA MÉTODOS SENSÍVEIS
  const token = req.headers.authorization

  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  // ➕ CRIAR PRODUTO
  if (method === 'POST') {
    const { nome, preco, descricao, imagem, estoque } = req.body

    const { data, error } = await supabase
      .from('produtos')
      .insert([{
        nome,
        preco,
        descricao,
        imagem,
        estoque,
        ativo: true
      }])

    if (error) return res.status(500).json({ error })

    return res.status(200).json(data)
  }

  // ✏️ ATUALIZAR ESTOQUE
  if (method === 'PUT') {
    const { id, estoque } = req.body

    const { data, error } = await supabase
      .from('produtos')
      .update({ estoque })
      .eq('id', id)

    if (error) return res.status(500).json({ error })

    return res.status(200).json(data)
  }

  // ❌ EXCLUIR
  if (method === 'DELETE') {
    const { id } = req.body

    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error })

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ message: 'Método não permitido' })
}