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
        {produtos.map(produto => (
          <div key={produto.id} style={{
            border: '1px solid #ccc',
            padding: 10,
            width: 200,
            borderRadius: 8
          }}>
            
            {/* IMAGEM DO PRODUTO */}
            <img
              src={produto.imagem || '/logo.png'}
              alt={produto.nome}
              style={{ width: '100%', height: 150, objectFit: 'cover' }}
            />

            <h3>{produto.nome}</h3>

            <p style={{ color: 'green', fontWeight: 'bold' }}>
              R$ {produto.preco}
            </p>

            <p>{produto.descricao}</p>

          </div>
        ))}
      </div>
    </div>
  )
}