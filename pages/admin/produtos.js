import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function AdminProdutos() {
  // --- ESTADOS (States) ---
  const [authorized, setAuthorized] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Estado para o formulário de novo produto
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: "",
    estoque: "",
    imagem: "",
    descricao: ""
  });

  // --- VERIFICAÇÃO DE ACESSO ---
  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
      fetchProdutos();
    }
  }, []);

  // --- BUSCA PRODUTOS NO BANCO ---
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

  // --- FUNÇÃO PARA CADASTRAR NOVO PRODUTO ---
  async function cadastrarProduto(e) {
    e.preventDefault(); // Impede a página de recarregar
    
    try {
      // Insere no banco convertendo preço e estoque para números
      const { error } = await supabase.from("produtos").insert([
        {
          nome: novoProduto.nome,
          preco: Number(novoProduto.preco),
          estoque: Number(novoProduto.estoque),
          imagem: novoProduto.imagem,
          descricao: novoProduto.descricao
        }
      ]);

      if (error) throw error;

      alert("Produto cadastrado com sucesso!");
      
      // Limpa o formulário
      setNovoProduto({ nome: "", preco: "", estoque: "", imagem: "", descricao: "" });
      
      // Atualiza a lista exibida
      fetchProdutos();
      
    } catch (err) {
      alert("Erro ao cadastrar: " + err.message);
    }
  }

  if (!authorized) return null;

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Gestão de Produtos (Estoque)</h1>
      
      <button 
        onClick={() => router.push("/admin/pedidos")}
        style={styles.btnNav}
      >
        ← Ver Pedidos
      </button>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <div style={styles.cardCadastro}>
        <h3>Cadastrar Novo Produto</h3>
        <form onSubmit={cadastrarProduto} style={styles.form}>
          <input 
            placeholder="Nome do Produto" 
            style={styles.input} 
            value={novoProduto.nome} 
            onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} 
            required 
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              placeholder="Preço (Ex: 330.00)" 
              type="number" 
              step="0.01" 
              style={styles.input} 
              value={novoProduto.preco} 
              onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})} 
              required 
            />
            <input 
              placeholder="Estoque" 
              type="number" 
              style={styles.input} 
              value={novoProduto.estoque} 
              onChange={(e) => setNovoProduto({...novoProduto, estoque: e.target.value})} 
              required 
            />
          </div>
          <input 
            placeholder="URL da Imagem" 
            style={styles.input} 
            value={novoProduto.imagem} 
            onChange={(e) => setNovoProduto({...novoProduto, imagem: e.target.value})} 
            required 
          />
          <textarea 
            placeholder="Descrição Completa" 
            style={{...styles.input, height: "80px"}} 
            value={novoProduto.descricao} 
            onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})} 
            required 
          />
          <button type="submit" style={styles.btnSalvar}>Salvar Produto</button>
        </form>
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* --- LISTA DE PRODUTOS --- */}
      {loading ? (
        <p>Carregando estoque...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #000" }}>
              <th style={{ padding: "10px" }}>Produto</th>
              <th style={{ padding: "10px" }}>Preço</th>
              <th style={{ padding: "10px" }}>Estoque</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{p.nome}</td>
                <td style={{ padding: "10px" }}>
                  {Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td style={{ padding: "10px" }}>{p.estoque || 0} unid.</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- ESTILOS INTERNOS ---
const styles = {
  btnNav: { marginBottom: "20px", padding: "10px 20px", cursor: "pointer", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "5px" },
  cardCadastro: { backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", border: "1px solid #eee" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "12px", border: "1px solid #ddd", borderRadius: "5px", width: "100%", boxSizing: "border-box" },
  btnSalvar: { padding: "15px", backgroundColor: "#27ae60", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }
};