import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function AdminProdutos() {
  const [authorized, setAuthorized] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica se você fez login na tela anterior
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
      const { data, error } = await supabase.from("produtos").select("*");
      if (error) throw error;
      setProdutos(data || []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!authorized) return null;

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h1>Gestão de Produtos (Estoque)</h1>
      <button 
        onClick={() => router.push("/admin/pedidos")}
        style={{ marginBottom: "20px", padding: "10px", cursor: "pointer" }}
      >
        Ver Pedidos
      </button>

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
                <td style={{ padding: "10px" }}>R$ {p.preco}</td>
                <td style={{ padding: "10px" }}>{p.estoque || 0} unid.</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}