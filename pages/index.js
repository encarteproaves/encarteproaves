import { useEffect, useState } from 'react'

export default function Home() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    fetch('/api/produto')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(err => console.error('Erro ao buscar produtos:', err))
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Produtos</h1>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {produtos.map((produto) => (
          <div
            key={produto.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 10,
              padding: 15,
              width: 250,
              textAlign: 'center'
            }}
          >
            <img
              src={produto.imagem || 'https://via.placeholder.com/150'}
              alt={produto.nome}
              style={{ width: '100%', height: 150, objectFit: 'cover' }}
            />

            <h3>{produto.nome}</h3>

            <p style={{ color: 'green', fontWeight: 'bold' }}>
              R$ {Number(produto.preco).toFixed(2)}
            </p>

            <p>{produto.descricao}</p>

            {/* Campo CEP */}
            <input
              type="text"
              placeholder="Digite seu CEP"
              style={{
                width: '100%',
                padding: 8,
                marginTop: 10,
                borderRadius: 5,
                border: '1px solid #ccc'
              }}
            />

            <button
              style={{
                marginTop: 10,
                width: '100%',
                padding: 10,
                background: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: 5
              }}
            >
              Calcular Frete
            </button>

            <button
              style={{
                marginTop: 10,
                width: '100%',
                padding: 10,
                background: 'green',
                color: '#fff',
                border: 'none',
                borderRadius: 5
              }}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}