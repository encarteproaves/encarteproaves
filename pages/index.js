import { useEffect, useState } from 'react'

export default function Home() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    fetch('/api/produto')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Produtos</h1>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {produtos.map((produto) => (
          <div key={produto.id} style={{ border: '1px solid #ccc', padding: 10 }}>
            <img
              src={produto.imagem || 'https://via.placeholder.com/150'}
              width="150"
            />
            <h3>{produto.nome}</h3>
            <p>R$ {produto.preco}</p>
            <p>{produto.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  )
}