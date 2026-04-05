import { useState } from 'react'

export default function AdminProdutos() {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState('')

  async function cadastrar(e) {
    e.preventDefault()

    await fetch('/api/produto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        preco,
        descricao,
        imagem,
      }),
    })

    alert('Produto cadastrado!')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Cadastro de Produtos</h1>

      <form onSubmit={cadastrar}>
        <input
          placeholder="Nome"
          onChange={(e) => setNome(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Preço"
          onChange={(e) => setPreco(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Descrição"
          onChange={(e) => setDescricao(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="URL da imagem"
          onChange={(e) => setImagem(e.target.value)}
        />
        <br /><br />

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}