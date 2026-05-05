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
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <img src={produto.imagem} style={{ width: "400px", borderRadius: "8px" }} />
        <div style={{ flex: 1 }}>
          <h1>{produto.nome}</h1>
          <h2 style={{ color: "#28a745" }}>{Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
          <div style={{ whiteSpace: "pre-wrap", marginBottom: "20px" }}>{produto.descricao_completa || produto.descricao}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input placeholder="CEP" value={cliente.cep} style={inputStyle} onChange={(e) => { setCliente({...cliente, cep: e.target.value}); buscarEndereco(e.target.value); }} />
            <input placeholder="Nome" style={inputStyle} onChange={(e) => setCliente({...cliente, nome: e.target.value})} />
            <input placeholder="CPF" style={inputStyle} onChange={(e) => setCliente({...cliente, cpf: e.target.value})} />
            <input placeholder="Telefone" style={inputStyle} onChange={(e) => setCliente({...cliente, telefone: e.target.value})} />
            <input placeholder="Endereço" value={cliente.endereco} style={inputStyle} onChange={(e) => setCliente({...cliente, endereco: e.target.value})} />
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Cidade" value={cliente.cidade} style={{...inputStyle, flex: 2}} readOnly />
              <input placeholder="Estado" value={cliente.estado} style={{...inputStyle, flex: 1}} readOnly />
            </div>
            <button onClick={calcularFrete} style={btnSecondary}>Calcular Frete</button>
          </div>

          {fretes.map((f, i) => (
            <label key={i} style={{ display: "flex", gap: "10px", marginTop: "10px", cursor: "pointer" }}>
              <input type="radio" name="frete" checked={freteSelecionado?.name === f.name} onChange={() => setFreteSelecionado(f)} />
              {f.name} - R$ {f.price.toFixed(2)}
            </label>
          ))}

          <h3 style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
          <button style={btnPrimary}>Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" };
const btnPrimary = { padding: "15px", background: "#000", color: "#fff", width: "100%", marginTop: "20px", cursor: "pointer", fontWeight: "bold" };
const btnSecondary = { padding: "15px", background: "#fff", border: "1px solid #000", cursor: "pointer", fontWeight: "bold" };