import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function AdminProdutos() {
  const [authorized, setAuthorized] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null); // Controla se estamos editando
  const router = useRouter();

  const [novoProduto, setNovoProduto] = useState({
    nome: "", preco: "", estoque: "", imagem: "", descricao: ""
  });

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
      fetchProdutos();
    }
  }, []);

  async function fetchProdutos() {
    try {
      const { data, error } = await supabase.from("produtos").select("*").order('created_at', { ascending: false });
      if (error) throw error;
      setProdutos(data || []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- SALVAR (CRIAR OU ATUALIZAR) ---
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const dadosProduto = {
        nome: novoProduto.nome,
        preco: Number(novoProduto.preco),
        estoque: Number(novoProduto.estoque),
        imagem: novoProduto.imagem,
        descricao: novoProduto.descricao
      };

      if (editandoId) {
        // Lógica de EDITAR
        const { error } = await supabase.from("produtos").update(dadosProduto).eq("id", editandoId);
        if (error) throw error;
        alert("Produto atualizado!");
      } else {
        // Lógica de CADASTRAR NOVO
        const { error } = await supabase.from("produtos").insert([dadosProduto]);
        if (error) throw error;
        alert("Produto cadastrado!");
      }

      setNovoProduto({ nome: "", preco: "", estoque: "", imagem: "", descricao: "" });
      setEditandoId(null);
      fetchProdutos();
    } catch (err) {
      alert("Erro operacional: " + err.message);
    }
  }

  // --- PREPARAR EDIÇÃO ---
  function prepararEdicao(p) {
    setEditandoId(p.id);
    setNovoProduto({
      nome: p.nome,
      preco: p.preco,
      estoque: p.estoque,
      imagem: p.imagem,
      descricao: p.descricao
    });
    window.scrollTo(0, 0); // Sobe a página para o formulário
  }

  // --- EXCLUIR PRODUTO ---
  async function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto? Esta ação não tem volta.")) {
      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) alert("Erro ao excluir");
      else fetchProdutos();
    }
  }

  if (!authorized) return null;

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Gestão de Produtos (Estoque)</h1>
      
      <button onClick={() => router.push("/admin/pedidos")} style={styles.btnNav}>← Ver Pedidos</button>

      <div style={styles.cardCadastro}>
        <h3>{editandoId ? "📝 Editando Produto" : "✨ Cadastrar Novo Produto"}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input placeholder="Nome do Produto" style={styles.input} value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} required />
          <div style={{ display: "flex", gap: "10px" }}>
            <input placeholder="Preço" type="number" step="0.01" style={styles.input} value={novoProduto.preco} onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})} required />
            <input placeholder="Estoque" type="number" style={styles.input} value={novoProduto.estoque} onChange={(e) => setNovoProduto({...novoProduto, estoque: e.target.value})} required />
          </div>
          <input placeholder="URL da Imagem" style={styles.input} value={novoProduto.imagem} onChange={(e) => setNovoProduto({...novoProduto, imagem: e.target.value})} required />
          <textarea placeholder="Descrição" style={{...styles.input, height: "60px"}} value={novoProduto.descricao} onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})} required />
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={styles.btnSalvar}>{editandoId ? "Atualizar" : "Salvar"}</button>
            {editandoId && <button type="button" onClick={() => {setEditandoId(null); setNovoProduto({nome:"",preco:"",estoque:"",imagem:"",descricao:""})}} style={styles.btnCancelar}>Cancelar</button>}
          </div>
        </form>
      </div>

      <hr style={{ margin: "40px 0" }} />

      {loading ? <p>Carregando...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #000" }}>
              <th style={{ padding: "10px" }}>Produto</th>
              <th style={{ padding: "10px" }}>Preço</th>
              <th style={{ padding: "10px" }}>Estoque</th>
              <th style={{ padding: "10px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{p.nome}</td>
                <td style={{ padding: "10px" }}>{Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td style={{ padding: "10px" }}>{p.estoque} un.</td>
                <td style={{ padding: "10px", display: "flex", gap: "5px" }}>
                  <button onClick={() => prepararEdicao(p)} style={styles.btnEdit}>Editar</button>
                  <button onClick={() => excluirProduto(p.id)} style={styles.btnDel}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  btnNav: { marginBottom: "20px", padding: "10px 20px", cursor: "pointer", borderRadius: "5px", border: "1px solid #ccc" },
  cardCadastro: { backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", border: "1px solid #eee" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "12px", border: "1px solid #ddd", borderRadius: "5px", width: "100%", boxSizing: "border-box" },
  btnSalvar: { flex: 2, padding: "15px", backgroundColor: "#27ae60", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" },
  btnCancelar: { flex: 1, padding: "15px", backgroundColor: "#666", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  btnEdit: { padding: "5px 10px", backgroundColor: "#f1c40f", border: "none", borderRadius: "3px", cursor: "pointer", fontWeight: "bold" },
  btnDel: { padding: "5px 10px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer", fontWeight: "bold" }
};