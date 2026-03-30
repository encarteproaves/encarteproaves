'use client'

import { useEffect, useState } from 'react'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([])
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState('')

  // 🔄 buscar produtos
  async function carregarProdutos() {
    try {
      const res = await fetch('/api/produto', {
        credentials: 'include',
      })

      const data = await res.json()

      if (Array.isArray(data)) {
        setProdutos(data)
      } else {
        console.error('Erro na API:', data)
        setProdutos([])
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      setProdutos([])
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  // ➕ adicionar produto
  async function adicionarProduto() {
    if (!nome || !preco) {
      alert('Preencha nome e preço')
      return
    }

    try {
      await fetch('/api/produto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nome,
          preco: Number(preco),
          descricao,
          imagem,
        }),
      })

      // limpar campos
      setNome('')
      setPreco('')
      setDescricao('')
      setImagem('')

      carregarProdutos()
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
    }
  }

  // ❌ excluir produto
  async function excluirProduto(id) {
    try {
      await fetch('/api/produto', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      })

      carregarProdutos()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cadastro de Produtos</h1>

      {/* FORMULÁRIO */}
      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Preço"
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          placeholder="URL da imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />

        <button onClick={adicionarProduto}>
          Salvar
        </button>
      </div>

      <h2>Lista de Produtos</h2>

      {/* LISTA */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {Array.isArray(produtos) &&
          produtos.map((produto) => (
            <div
              key={produto.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                width: '250px',
                borderRadius: '8px',
              }}
            >
              {/* IMAGEM */}
              {produto.imagem && (
  <img
    src={produto.imagem}
    alt={produto.nome}
    style={{
      width: '100%',
      height: '150px',
      objectFit: 'cover',
    }}
  />
)}
                
              <h3>{produto.nome}</h3>

              {/* PREÇO FORMATADO */}
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
              </p>

              <p>{produto.descricao}</p>

              <button
                onClick={() => excluirProduto(produto.id)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                Excluir
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}