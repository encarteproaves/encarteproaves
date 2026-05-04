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

  useEffect(() => {
    async function carregarProduto() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProduto(data);
        setTotal(Number(data.preco));
      } catch (err) {
        setErro("Produto não encontrado.");
      }
    }
    carregarProduto();
  }, [id]);

  // Atualiza o total quando o frete é selecionado
  useEffect(() => {
    if (produto && freteSelecionado) {
      setTotal(Number(produto.preco) + Number(freteSelecionado.price || 0));
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
      if (Array.isArray(data)) {
        setFretes(data);
        if (data.length > 0) {
          setFreteSelecionado(data[0]);
        }
      }
    } catch (err) {
      alert("Erro ao calcular frete");
    }
  };

  const comprar = async () => {
    if (!cliente.nome || !cliente.telefone || !cliente.cep || !cliente.cpf) {
      return alert("Preencha Nome, Telefone, CPF e CEP");
    }
    if (!freteSelecionado) return alert("Selecione um frete");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: cliente.nome,
          customerEmail: `${cliente.telefone}@paves.com`,
          phoneNumber: cliente.telefone,
          shippingCep: cliente.cep,
          shippingCost: Number(freteSelecionado.price || 0),
          items: [{
            id: produto.id,
            name: produto.nome,
            price: Number(produto.preco),
            quantity: 1
          }],
          metadata: { ...cliente }
        })
      });
      const data = await res.json();
      if (data.init_point) window.location.href = data.init_point;
    } catch (error) {
      alert("Erro ao processar pagamento");
    }
  };

  if (erro) return <p>{erro}</p>;
  if (!produto) return <p>Carregando...</p>;

  // REGRA: Só exibe o campo se o nome do produto tiver "Pen Drive"
  const ehPenDrive = produto.nome.toLowerCase().includes("pen drive");

  return (
    <div style={{ padding: "20px", fontFamily: 'Segoe UI, Roboto, sans-serif', maxWidth: "1100px", margin: "0 auto" }}>
      
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* LADO ESQUERDO: IMAGEM */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <img src={produto.imagem} alt={produto.nome} style={{ width: "100%", borderRadius: "4px" }} />
        </div>

        {/* LADO DIREITO: INFOS E FORMULÁRIO */}
        <div style={{ flex: "1.2", minWidth: "320px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "bold", margin: "0 0 10px 0" }}>{produto.nome}</h1>
          
          <div style={{ color: "#28a745", fontSize: "30px", fontWeight: "bold", marginBottom: "5px" }}>
            {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          
          {produto.estoque > 0 && (
            <p style={{ color: "red", fontSize: "14px", fontWeight: "600", marginBottom: "15px" }}>
              Restam apenas {produto.estoque} unidades
            </p>
          )}
          
          {/* DESCRIÇÃO COMPLETA - Mantendo formatação original */}
          <div style={{ whiteSpace: "pre-wrap", color: "#444", lineHeight: "1.5", fontSize: "15px", marginBottom: "25px" }}>
            {produto.descricao}
          </div>

          {/* FORMULÁRIO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input placeholder="Digite seu CEP" style={inputStyle} onChange={(e) => setCliente({ ...cliente, cep: e.target.value })} />
            <input placeholder="Seu nome" style={inputStyle} onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
            <input placeholder="Telefone" style={inputStyle} onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} />
            <input placeholder="CPF" style={inputStyle} onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })} />
            <input placeholder="Endereço" style={inputStyle} onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })} />
            
            <div style={{ display: "flex", gap: "10px" }}>
               <input placeholder="Número" style={{...inputStyle, flex: 1}} onChange={(e) => setCliente({ ...cliente, numero: e.target.value })} />
               <input placeholder="Bairro" style={{...inputStyle, flex: 2}} onChange={(e) => setCliente({ ...cliente, bairro: e.target.value })} />
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
               <input placeholder="Cidade" style={{...inputStyle, flex: 2}} onChange={(e) => setCliente({ ...cliente, cidade: e.target.value })} />
               <input placeholder="Estado" style={{...inputStyle, flex: 1}} onChange={(e) => setCliente({ ...cliente, estado: e.target.value })} />
            </div>

            {/* SÓ APARECE NO PEN DRIVE */}
            {ehPenDrive && (
              <input 
                placeholder="Digite o nome do canto" 
                style={{...inputStyle, border: "1px solid #000"}} 
                onChange={(e) => setCliente({ ...cliente, canto: e.target.value })} 
              />
            )}
            
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button onClick={calcularFrete} style={btnSecondary}>Calcular Frete</button>
              <button onClick={comprar} style={btnPrimary}>Compra segura</button>
            </div>
          </div>

          <div style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>
      </div>

      {/* RODAPÉ WHATSAPP */}
      <a 
        href={`https://wa.me/5581993414930?text=Olá, tenho interesse no produto: ${produto.nome}`}
        target="_blank" rel="noopener noreferrer" style={whatsappBtn}
      >
        Falar no WhatsApp
      </a>
      
      {/* Espaçamento extra no fundo para o botão fixo não cobrir o total */}
      <div style={{ height: "100px" }}></div>
    </div>
  );
}

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", width: "100%", boxSizing: "border-box", fontSize: "14px" };
const btnPrimary = { padding: "12px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "2px" };
const btnSecondary = { padding: "12px", backgroundColor: "#fff", border: "1px solid #ccc", cursor: "pointer", fontWeight: "bold", borderRadius: "2px" };
const whatsappBtn = {
  position: "fixed", bottom: "0", left: "0", width: "100%", zIndex: 999,
  backgroundColor: "#25d366", color: "white", padding: "18px",
  textDecoration: "none", fontWeight: "bold", textAlign: "center", fontSize: "18px"
};