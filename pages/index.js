export default function Home({ produtos }) {
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

// 🔥 BUSCA NO SERVIDOR (CORRETO PARA VERCEL)
export async function getServerSideProps() {
  const res = await fetch('https://www.encarteproaves.com.br/api/produto')
  const produtos = await res.json()

  return {
    props: { produtos },
  }
}