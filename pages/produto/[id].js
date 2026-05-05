import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Produto() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState(null);
  const [cliente, setCliente] = useState({
    nome: "", telefone: "", cpf: "", cep: "",
    endereco: "", numero: "", bairro: "",
    cidade: "", estado: "", canto: ""
  });

  const [fretes, setFretes] = useState([]);
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [total, setTotal] = useState(0);

  const buscarEndereco = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();
        if (data.erro) {
          alert("CEP inválido!");
          return;
        }
        setCliente((prev) => ({
          ...prev, cep: cepLimpo, endereco: data.logradouro,
          bairro: data.bairro, cidade: data.localidade, estado: data.uf
        }));
      } catch (err) { console.error("Erro CEP", err); }
    }
  };

  useEffect(() => {
    async function carregarProduto() {
      if (!id) return;
      try {
        const { data, error } = await supabase.from("produtos").select("*").eq("id", id).single();
        if (error) throw error;
        setProduto(data);
        setTotal(Number(data.preco));
      } catch (err) { setErro("Produto não encontrado."); }
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
    if (!cliente.cep) return alert("Digite o CEP");
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
        alert("Nenhuma transportadora disponível para este CEP.");
      }
    } catch (err) { alert("Erro ao calcular frete"); }
  };

  const comprar = async () => {
    if (!cliente.nome || !cliente.telefone || !cliente.cep || !cliente.cpf) return alert("Preencha os campos!");
    if (!freteSelecionado) return alert("Selecione o frete!");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: cliente.nome, phoneNumber: cliente.telefone,
          shippingCep: cliente.cep, shippingCost: Number(freteSelecionado.price),
          items: [{ id: produto.id, name: produto.nome, price: Number(produto.preco), quantity: 1 }],
          metadata: { ...cliente, frete_escolhido: freteSelecionado.name }
        })
      });
      const data = await res.json();
      if (data.init_point) window.location.href = data.init_point;
    } catch (error) { alert("Erro checkout"); }
  };

  if (erro) return <div style={{ padding: "50px", textAlign: "center" }}>{erro}</div>;
  if (!produto) return <div style={{ padding: "50px", textAlign: "center" }}>Carregando...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto", paddingBottom: "120px" }}>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <img src={produto.imagem} alt={produto.nome} style={{ width: "100%", borderRadius: "8px" }} />
        </div>

        <div style={{ flex: "1.2", minWidth: "320px" }}>
          <h1 style={{ fontSize: "28px", margin: "0" }}>{produto.nome}</h1>
          <div style={{ color: "#28a745", fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}>
            {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div style={{ whiteSpace: "pre-wrap", color: "#444", marginBottom: "20px" }}>
            {produto.descricao_completa || produto.descricao}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input placeholder="CEP" value={cliente.cep} style={inputStyle} onChange={(e) => { setCliente({...cliente, cep: e.target.value}); buscarEndereco(e.target.value); }} />
            <input placeholder="Nome" value={cliente.nome} style={inputStyle} onChange={(e) => setCliente({...cliente, nome: e.target.value})} />
            <input placeholder="Telefone" value={cliente.telefone} style={inputStyle} onChange={(e) => setCliente({...cliente, telefone: e.target.value})} />
            <input placeholder="CPF" value={cliente.cpf} style={inputStyle} onChange={(e) => setCliente({...cliente, cpf: e.target.value})} />
            <input placeholder="Endereço" value={cliente.endereco} style={inputStyle} onChange={(e) => setCliente({...cliente, endereco: e.target.value})} />
            <div style={{ display: "flex", gap: "10px" }}>
               <input placeholder="Nº" value={cliente.numero} style={{...inputStyle, flex: 1}} onChange={(e) => setCliente({...cliente, numero: e.target.value})} />
               <input placeholder="Bairro" value={cliente.bairro} style={{...inputStyle, flex: 2}} onChange={(e) => setCliente({...cliente, bairro: e.target.value})} />
            </div>
            {produto.nome.toLowerCase().includes("pen drive") && (
              <input placeholder="Nome do canto" value={cliente.canto} style={{...inputStyle, border: "2px solid #333"}} onChange={(e) => setCliente({...cliente, canto: e.target.value})} />
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button onClick={calcularFrete} style={btnSecondary}>Calcular Frete</button>
              <button onClick={comprar} style={btnPrimary}>Compra segura</button>
            </div>
          </div>

          {/* LISTAGEM DINÂMICA DE FRETE */}
          {fretes.length > 0 && (
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px", padding: "15px", border: "1px solid #eee", borderRadius: "8px", background: "#fdfdfd" }}>
              <span style={{ fontWeight: "bold", fontSize: "14px" }}>Escolha a entrega:</span>
              {fretes.map((f, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
                  <input type="radio" name="frete" checked={freteSelecionado?.name === f.name} onChange={() => setFreteSelecionado(f)} />
                  {f.name} - R$ {f.price.toFixed(2)} ({f.deadline} dias)
                </label>
              ))}
            </div>
          )}

          <div style={{ marginTop: "25px", fontSize: "22px", fontWeight: "bold", borderTop: "2px solid #000", paddingTop: "15px" }}>
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>
      </div>
      <a href={`https://wa.me/5581993414930?text=Olá, interesse no produto: ${produto.nome}`} target="_blank" rel="noopener noreferrer" style={whatsappBtn}>Falar no WhatsApp</a>
    </div>
  );
}

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "5px", width: "100%", boxSizing: "border-box" };
const btnPrimary = { padding: "15px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1, borderRadius: "5px" };
const btnSecondary = { padding: "15px", backgroundColor: "#fff", border: "1px solid #000", cursor: "pointer", fontWeight: "bold", flex: 1, borderRadius: "5px" };
const whatsappBtn = { position: "fixed", bottom: "0", left: "0", width: "100%", backgroundColor: "#25d366", color: "white", padding: "20px", textDecoration: "none", fontWeight: "bold", textAlign: "center", fontSize: "18px", zIndex: 1000 };