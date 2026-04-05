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
    setNome('')
    setPreco('')
    setDescricao('')
    setImagem('')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Cadastro de Produtos</h1>

      <form onSubmit={cadastrar}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="URL da imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />
        <br /><br />

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}