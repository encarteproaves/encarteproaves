import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Produto() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [fretes, setFretes] = useState([]);
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [total, setTotal] = useState(0);

  const [cliente, setCliente] = useState({
    nome: "", telefone: "", cpf: "", cep: "",
    endereco: "", numero: "", bairro: "",
    cidade: "", estado: "", canto: ""
  });

  const buscarEndereco = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCliente((prev) => ({
            ...prev, cep: cepLimpo, endereco: data.logradouro,
            bairro: data.bairro, cidade: data.localidade, estado: data.uf
          }));
        }
      } catch (err) { console.error(err); }
    }
  };

  useEffect(() => {
    async function carregarProduto() {
      if (!id) return;
      const { data } = await supabase.from("produtos").select("*").eq("id", id).single();
      if (data) {
        setProduto(data);
        setTotal(Number(data.preco));
      }
    }
    carregarProduto();
  }, [id]);

  useEffect(() => {
    if (produto) {
      const valorFrete = Number(freteSelecionado?.price || 0);
      setTotal(Number(produto.preco) + valorFrete);
    }
  }, [freteSelecionado, produto]);

  const calcularFrete = async () => {
    if (!cliente.cep) return alert("Digite o CEP primeiro.");
    try {
      const res = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: cliente.cep, produtoId: produto.id })
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setFretes(data);
        setFreteSelecionado(data[0]);
      } else {
        alert("Nenhuma transportadora disponível para este peso/CEP.");
      }
    } catch (err) { alert("Erro ao calcular."); }
  };

  if (!produto) return <div style={{padding: "50px", textAlign: "center"}}>Carregando...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif", paddingBottom: "100px" }}>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <img src={produto.imagem} style={{ width: "100%", borderRadius: "8px" }} />
        </div>

        <div style={{ flex: "1.2", minWidth: "320px" }}>
          <h1>{produto.nome}</h1>
          <div style={{ color: "#28a745", fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}>
            {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          
          {/* VOLTA DA DESCRIÇÃO COMPLETA */}
          <div style={{ whiteSpace: "pre-wrap", color: "#444", marginBottom: "20px", fontSize: "15px", lineHeight: "1.6" }}>
            {produto.descricao_completa || produto.descricao}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input placeholder="CEP" value={cliente.cep} style={inputStyle} onChange={(e) => { setCliente({...cliente, cep: e.target.value}); buscarEndereco(e.target.value); }} />
            <input placeholder="Nome Completo" style={inputStyle} onChange={(e) => setCliente({...cliente, nome: e.target.value})} />
            <input placeholder="Telefone" style={inputStyle} onChange={(e) => setCliente({...cliente, telefone: e.target.value})} />
            <input placeholder="CPF" style={inputStyle} onChange={(e) => setCliente({...cliente, cpf: e.target.value})} />
            <input placeholder="Endereço" value={cliente.endereco} style={inputStyle} onChange={(e) => setCliente({...cliente, endereco: e.target.value})} />
            
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Nº" style={{...inputStyle, flex: 1}} onChange={(e) => setCliente({...cliente, numero: e.target.value})} />
              <input placeholder="Bairro" value={cliente.bairro} style={{...inputStyle, flex: 2}} onChange={(e) => setCliente({...cliente, bairro: e.target.value})} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Cidade" value={cliente.cidade} style={{...inputStyle, flex: 2}} onChange={(e) => setCliente({...cliente, cidade: e.target.value})} />
              <input placeholder="Estado" value={cliente.estado} style={{...inputStyle, flex: 1}} onChange={(e) => setCliente({...cliente, estado: e.target.value})} />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={calcularFrete} style={btnSecondary}>Calcular Frete</button>
              <button style={btnPrimary}>Compra segura</button>
            </div>
          </div>

          {fretes.length > 0 && (
            <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#f9f9f9" }}>
              {fretes.map((f, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", cursor: "pointer" }}>
                  <input type="radio" name="frete" checked={freteSelecionado?.name === f.name} onChange={() => setFreteSelecionado(f)} />
                  <span>{f.name} - R$ {f.price.toFixed(2)} ({f.deadline} dias)</span>
                </label>
              ))}
            </div>
          )}

          <div style={{ marginTop: "30px", fontSize: "24px", fontWeight: "bold", borderTop: "2px solid #eee", paddingTop: "20px" }}>
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "5px", width: "100%", boxSizing: "border-box" };
const btnPrimary = { padding: "15px", background: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "5px", flex: 1 };
const btnSecondary = { padding: "15px", background: "#fff", border: "1px solid #000", cursor: "pointer", fontWeight: "bold", borderRadius: "5px", flex: 1 };