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
  const [novoEstoque, setNovoEstoque] = useState("");

  const [token, setToken] = useState("");

  // 🔐 LOGIN
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
      headers: {
        authorization: tk
      }
    });

    const data = await res.json();
    setProdutos(data);
  }

  async function cadastrarProduto() {
    await fetch("/api/produto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token
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

  async function excluirProduto(id) {
    await fetch("/api/produto", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      },
      body: JSON.stringify({ id }),
    });

    carregarProdutos(token);
  }

  async function atualizarEstoque(id) {
    await fetch("/api/produto", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      },
      body: JSON.stringify({
        id,
        estoque: Number(novoEstoque),
      }),
    });

    setEditandoId(null);
    setNovoEstoque("");
    carregarProdutos(token);
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
    <div style={{ padding: 20 }}>
      <h1>Cadastro de Produtos</h1>

      <button onClick={() => window.location.href = "/"}>Sair</button>

      <div style={{ marginTop: 20 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /><br />
        <input placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} /><br />
        <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} /><br />
        <input placeholder="Imagem" value={imagem} onChange={(e) => setImagem(e.target.value)} /><br />
        <input placeholder="Estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} /><br />
        <button onClick={cadastrarProduto}>Salvar</button>
      </div>

      <h2>Lista</h2>

      {produtos.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15, width: 300 }}>
          <img src={p.imagem} width="100%" />
          <h3>{p.nome}</h3>
          <p>R$ {p.preco}</p>
          <p>{p.descricao}</p>

          <p>Estoque: {p.estoque}</p>

          {editandoId === p.id ? (
            <>
              <input value={novoEstoque} onChange={(e) => setNovoEstoque(e.target.value)} />
              <button onClick={() => atualizarEstoque(p.id)}>Salvar</button>
            </>
          ) : (
            <button onClick={() => setEditandoId(p.id)}>Editar Estoque</button>
          )}

          <br />

          <button onClick={() => excluirProduto(p.id)} style={{ background: "red", color: "#fff" }}>
            Excluir
          </button>
        </div>
      ))}
    </div>
  );
}