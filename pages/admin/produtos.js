// ===============================
// IMPORTAÇÕES
// ===============================

// Hooks do React (estado e efeitos)
import { useEffect, useState } from "react";


// ===============================
// COMPONENTE ADMIN DE PRODUTOS
// ===============================
export default function AdminProdutos() {

  // ===============================
  // ESTADOS PRINCIPAIS
  // ===============================
  const [produtos, setProdutos] = useState([]); // Lista de produtos
  const [autorizado, setAutorizado] = useState(false); // Controle de acesso

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [estoque, setEstoque] = useState("");

  const [editandoId, setEditandoId] = useState(null); // ID em edição
  const [token, setToken] = useState(""); // Token admin
  // ===============================
  // FIM ESTADOS
  // ===============================


  // ===============================
  // VERIFICAÇÃO DE ACESSO (LOGIN)
  // ===============================
  useEffect(() => {

    // Solicita senha ao abrir página
    const senha = prompt("Digite a senha do admin:");

    // Valida senha com variável de ambiente
    if (senha === process.env.NEXT_PUBLIC_ADMIN_TOKEN) {

      setToken(senha);
      setAutorizado(true);

      // Carrega produtos após login
      carregarProdutos(senha);

    } else {

      alert("Acesso negado");

      // Redireciona para home
      window.location.href = "/";
    }

  }, []);
  // ===============================
  // FIM AUTENTICAÇÃO
  // ===============================


  // ===============================
  // BUSCAR PRODUTOS
  // ===============================
  async function carregarProdutos(tk) {

    const res = await fetch("/api/produto", {
      headers: { authorization: tk },
    });

    const data = await res.json();

    setProdutos(data);
  }
  // ===============================
  // FIM BUSCA
  // ===============================


  // ===============================
  // CADASTRAR PRODUTO
  // ===============================
  async function cadastrarProduto() {

    // Validação básica
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

    // Limpa formulário e recarrega lista
    limpar();
    carregarProdutos(token);
  }
  // ===============================
  // FIM CADASTRO
  // ===============================


  // ===============================
  // ATUALIZAR PRODUTO
  // ===============================
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

    // Sai do modo edição
    setEditandoId(null);

    limpar();
    carregarProdutos(token);
  }
  // ===============================
  // FIM UPDATE
  // ===============================


  // ===============================
  // EXCLUIR PRODUTO
  // ===============================
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
  // ===============================
  // FIM DELETE
  // ===============================


  // ===============================
  // INICIAR EDIÇÃO
  // ===============================
  function iniciarEdicao(p) {

    setEditandoId(p.id);

    // Preenche formulário com dados do produto
    setNome(p.nome);
    setPreco(p.preco);
    setDescricao(p.descricao);
    setImagem(p.imagem);
    setEstoque(p.estoque);
  }
  // ===============================
  // FIM EDIÇÃO
  // ===============================


  // ===============================
  // LIMPAR FORMULÁRIO
  // ===============================
  function limpar() {
    setNome("");
    setPreco("");
    setDescricao("");
    setImagem("");
    setEstoque("");
  }
  // ===============================
  // FIM LIMPAR
  // ===============================


  // ===============================
  // BLOQUEIO SE NÃO AUTORIZADO
  // ===============================
  if (!autorizado) return null;
  // ===============================
  // FIM BLOQUEIO
  // ===============================


  // ===============================
  // RENDER PRINCIPAL
  // ===============================
  return (

    <div style={{ padding: 30, maxWidth: 1200, margin: "0 auto" }}>

      {/* TÍTULO */}
      <h1 style={{ marginBottom: 20 }}>
        📦 Painel de Produtos
      </h1>


      {/* ===============================
          FORMULÁRIO
         =============================== */}
      <div style={{
        background: "#f9f9f9",
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
      }}>

        {/* Título dinâmico */}
        <h2>
          {editandoId ? "✏️ Editar Produto" : "➕ Novo Produto"}
        </h2>

        {/* INPUTS */}
        <div style={{ display: "grid", gap: 10 }}>
          <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} />
          <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <input placeholder="URL da imagem" value={imagem} onChange={(e) => setImagem(e.target.value)} />
          <input placeholder="Estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} />
        </div>

        {/* BOTÃO SALVAR / ATUALIZAR */}
        <button
          onClick={() =>
            editandoId
              ? atualizarProduto(editandoId)
              : cadastrarProduto()
          }
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
      {/* ===============================
          FIM FORMULÁRIO
         =============================== */}


      {/* ===============================
          LISTA DE PRODUTOS
         =============================== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 20,
      }}>

        {produtos.map((p) => (

          // ===============================
          // CARD PRODUTO
          // ===============================
          <div key={p.id} style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            background: "#fff",
          }}>

            {/* IMAGEM */}
            <img src={p.imagem} style={{ width: "100%", borderRadius: 5 }} />

            {/* DADOS */}
            <h3>{p.nome}</h3>
            <p><strong>R$ {p.preco}</strong></p>
            <p style={{ fontSize: 14 }}>{p.descricao}</p>
            <p>Estoque: {p.estoque}</p>


            {/* BOTÕES */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>

              {/* EDITAR */}
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

              {/* EXCLUIR */}
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
          // ===============================
          // FIM CARD PRODUTO
          // ===============================

        ))}

      </div>
      {/* ===============================
          FIM LISTA
         =============================== */}

    </div>
  );
  // ===============================
  // FIM RENDER
  // ===============================
}
// ===============================
// FIM COMPONENTE
// ===============================