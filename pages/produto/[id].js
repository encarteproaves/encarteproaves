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
    endereco: "", numero: "", bairro: "", cidade: "", estado: ""
  });

  const buscarEndereco = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setCliente(prev => ({
          ...prev, cep: cepLimpo, endereco: data.logradouro,
          bairro: data.bairro, cidade: data.localidade, estado: data.uf
        }));
      }
    }
  };

  useEffect(() => {
    async function carregar() {
      if (!id) return;
      const { data } = await supabase.from("produtos").select("*").eq("id", id).single();
      if (data) {
        setProduto(data);
        setTotal(Number(data.preco));
      }
    }
    carregar();
  }, [id]);

  useEffect(() => {
    if (produto) {
      setTotal(Number(produto.preco) + Number(freteSelecionado?.price || 0));
    }
  }, [freteSelecionado, produto]);

  const calcularFrete = async () => {
    if (!cliente.cep) return alert("Informe o CEP");
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
      alert("Nenhuma transportadora disponível.");
    }
  };

  if (!produto) return <p>Carregando...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif", paddingBottom: "100px" }}>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        <div style={{ flex: "1", minWidth: "350px" }}>
          <img src={produto.imagem} style={{ width: "100%", borderRadius: "8px" }} />
        </div>

        <div style={{ flex: "1.5", minWidth: "320px" }}>
          <h1>{produto.nome}</h1>
          <h2 style={{ color: "#28a745" }}>{Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
          
          <div style={{ whiteSpace: "pre-wrap", marginBottom: "30px", color: "#333", lineHeight: "1.6" }}>
            {produto.descricao_completa || produto.descricao}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
            <input placeholder="CEP" value={cliente.cep} style={inputStyle} onChange={(e) => { setCliente({...cliente, cep: e.target.value}); buscarEndereco(e.target.value); }} />
            <input placeholder="Nome Completo" style={inputStyle} onChange={(e) => setCliente({...cliente, nome: e.target.value})} />
            <input placeholder="CPF" style={inputStyle} onChange={(e) => setCliente({...cliente, cpf: e.target.value})} />
            <input placeholder="Telefone" style={inputStyle} onChange={(e) => setCliente({...cliente, telefone: e.target.value})} />
            <input placeholder="Endereço" value={cliente.endereco} style={inputStyle} onChange={(e) => setCliente({...cliente, endereco: e.target.value})} />
            
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Nº" style={{...inputStyle, flex: 1}} onChange={(e) => setCliente({...cliente, numero: e.target.value})} />
              <input placeholder="Bairro" value={cliente.bairro} style={{...inputStyle, flex: 2}} onChange={(e) => setCliente({...cliente, bairro: e.target.value})} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Cidade" value={cliente.cidade} style={{...inputStyle, flex: 2}} readOnly />
              <input placeholder="Estado" value={cliente.estado} style={{...inputStyle, flex: 1}} readOnly />
            </div>
            
            <button onClick={calcularFrete} style={btnSecondary}>Calcular Frete</button>
          </div>

          {fretes.length > 0 && (
            <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
              {fretes.map((f, i) => (
                <label key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", cursor: "pointer" }}>
                  <input type="radio" name="frete" checked={freteSelecionado?.id === f.id} onChange={() => setFreteSelecionado(f)} />
                  {f.name} - R$ {f.price.toFixed(2)}
                </label>
              ))}
            </div>
          )}

          <h3 style={{ marginTop: "25px", borderTop: "2px solid #eee", paddingTop: "20px" }}>
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
          <button style={btnPrimary}>Finalizar Compra</button>
        </div>
      </div>

      <a href={`https://wa.me/5581993414930?text=Olá, interesse no produto: ${produto.nome}`} target="_blank" rel="noopener noreferrer" style={whatsappBtn}>Falar no WhatsApp</a>
    </div>
  );
}

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "5px", width: "100%", boxSizing: "border-box" };
const btnPrimary = { padding: "18px", background: "#000", color: "#fff", width: "100%", marginTop: "20px", cursor: "pointer", fontWeight: "bold", border: "none", borderRadius: "5px", fontSize: "16px" };
const btnSecondary = { padding: "12px", background: "#fff", border: "1px solid #000", cursor: "pointer", fontWeight: "bold", borderRadius: "5px" };
const whatsappBtn = { position: "fixed", bottom: "0", left: "0", width: "100%", backgroundColor: "#25d366", color: "white", padding: "20px", textDecoration: "none", fontWeight: "bold", textAlign: "center", fontSize: "18px", zIndex: 1000 };