import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProdutoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProduto() {
      try {
        const res = await fetch(`/api/produto?id=${id}`);
        const data = await res.json();

        setProduto(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduto();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;

  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        
        {/* IMAGEM */}
        <div>
          <img
            src={produto.imagem}
            alt={produto.nome}
            style={{ width: 300, borderRadius: 10 }}
          />
        </div>

        {/* INFO */}
        <div style={{ flex: 1 }}>
          <h1>{produto.nome}</h1>

          <h2 style={{ color: "green" }}>
            R$ {Number(produto.preco).toFixed(2)}
          </h2>

          <p>{produto.descricao}</p>

          <p style={{ color: "red" }}>
            Restam apenas {produto.estoque} unidades
          </p>

          <hr />

          {/* FORMULÁRIO */}
          <input placeholder="Digite seu CEP" style={input} />
          <input placeholder="Seu nome" style={input} />
          <input placeholder="Telefone" style={input} />
          <input placeholder="CPF" style={input} />
          <input placeholder="Endereço" style={input} />
          <input placeholder="Número" style={input} />
          <input placeholder="Bairro" style={input} />
          <input placeholder="Cidade" style={input} />
          <input placeholder="Estado" style={input} />

          <div style={{ marginTop: 10 }}>
            <button style={btn}>Calcular Frete</button>
            <button style={btn}>Compra segura</button>
          </div>

          <button style={whats}>
            Falar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

const input = {
  display: "block",
  width: "100%",
  marginBottom: 8,
  padding: 8,
};

const btn = {
  marginRight: 10,
  padding: 10,
};

const whats = {
  marginTop: 10,
  padding: 12,
  width: "100%",
  backgroundColor: "green",
  color: "white",
  border: "none",
};