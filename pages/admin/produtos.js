import { useEffect, useState } from "react";

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [autorizado, setAutorizado] = useState(false);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [estoque, setEstoque] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const senha = prompt("Digite a senha do admin:");

    if (senha === process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      setToken(senha);
      setAutorizado(true);
      carregarProdutos(senha);
    } else {
      alert("Acesso negado");
      window.location.href = "/";
    }
  }, []);

  async function carregarProdutos(tk) {
    const res = await fetch("/api/produto", {
      headers: { authorization: tk },
    });

    const data = await res.json();
    setProdutos(data);
  }

  async function cadastrarProduto() {
    if (!nome || !preco) {
      alert("Preencha nome e preço");
      return;
    }

    await fetch("/api/produto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        nome,
        preco: Number(preco),
        descricao,
        imagem,
        estoque: Number(estoque),
      }),
    });

    limpar();
    carregarProdutos(token);
  }

  async function atualizarProduto(id) {
    await fetch("/api/produto", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        id,
        nome,
        preco: Number(preco),
        descricao,
        imagem,
        estoque: Number(estoque),
      }),
    });

    setEditandoId(null);
    limpar();
    carregarProdutos(token);
  }

  async function excluirProduto(id) {
    const confirmar = confirm("Excluir produto?");
    if (!confirmar) return;

    await fetch("/api/produto", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ id }),
    });

    carregarProdutos(token);
  }

  function iniciarEdicao(p) {
    setEditandoId(p.id);
    setNome(p.nome);
    setPreco(p.preco);
    setDescricao(p.descricao);
    setImagem(p.imagem);
    setEstoque(p.estoque);
  }

  function limpar() {
    setNome("");
    setPreco("");
    setDescricao("");
    setImagem("");
    setEstoque("");
  }

  if (!autorizado) return null;

  return (
    <div style={{ padding: 30, maxWidth: 1200, margin: "0 auto" }}>
      
      <h1 style={{ marginBottom: 20 }}>📦 Painel de Produtos</h1>

      {/* FORM */}
      <div
        style={{
          background: "#f9f9f9",
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
        }}
      >
        <h2>{editandoId ? "✏️ Editar Produto" : "➕ Novo Produto"}</h2>

        <div style={{ display: "grid", gap: 10 }}>
          <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} />
          <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <input placeholder="URL da imagem" value={imagem} onChange={(e) => setImagem(e.target.value)} />
          <input placeholder="Estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} />
        </div>

        <button
          onClick={() => editandoId ? atualizarProduto(editandoId) : cadastrarProduto()}
          style={{
            marginTop: 15,
            padding: 10,
            background: editandoId ? "#f59e0b" : "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          {editandoId ? "Atualizar Produto" : "Salvar Produto"}
        </button>
      </div>

      {/* LISTA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 20,
        }}
      >
        {produtos.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              background: "#fff",
            }}
          >
            <img src={p.imagem} style={{ width: "100%", borderRadius: 5 }} />

            <h3>{p.nome}</h3>
            <p><strong>R$ {p.preco}</strong></p>
            <p style={{ fontSize: 14 }}>{p.descricao}</p>
            <p>Estoque: {p.estoque}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button
                onClick={() => iniciarEdicao(p)}
                style={{
                  flex: 1,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: 8,
                  borderRadius: 5,
                }}
              >
                Editar
              </button>

              <button
                onClick={() => excluirProduto(p.id)}
                style={{
                  flex: 1,
                  background: "red",
                  color: "#fff",
                  border: "none",
                  padding: 8,
                  borderRadius: 5,
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}