import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Produto() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState(null);

  // Estado completo do cliente (restaurado)
  const [cliente, setCliente] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    canto: ""
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
          setTotal(Number(produto.preco) + Number(data[0].price || 0));
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
          customerEmail: `${cliente.telefone}@paves.com`, // Fallback
          phoneNumber: cliente.telefone,
          shippingCep: cliente.cep,
          shippingCost: Number(freteSelecionado.price || 0),
          items: [{
            id: produto.id,
            name: produto.nome,
            price: Number(produto.preco),
            quantity: 1
          }],
          metadata: { ...cliente } // Envia todos os dados coletados
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

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* LADO ESQUERDO: IMAGEM */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <img 
            src={produto.imagem} 
            alt={produto.nome} 
            style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} 
          />
        </div>

        {/* LADO DIREITO: INFOS E FORMULÁRIO */}
        <div style={{ flex: "1.5", minWidth: "300px" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>{produto.nome}</h1>
          <h2 style={{ color: "#28a745", fontSize: "28px" }}>
            {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h2>
          
          {produto.estoque > 0 && (
            <p style={{ color: "red", fontWeight: "bold" }}>Restam apenas {produto.estoque} unidades</p>
          )}
          
          <p style={{ lineHeight: "1.6", color: "#555" }}>{produto.descricao}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" }}>
            <input placeholder="Digite seu CEP" style={inputStyle} onChange={(e) => setCliente({ ...cliente, cep: e.target.value })} />
            <input placeholder="Seu nome" style={inputStyle} onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
            <input placeholder="Telefone" style={inputStyle} onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} />
            <input placeholder="CPF" style={inputStyle} onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })} />
            <input placeholder="Endereço" style={inputStyle} onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })} />
            <div style={{ display: "flex", gap: "8px" }}>
               <input placeholder="Número" style={{...inputStyle, flex: 1}} onChange={(e) => setCliente({ ...cliente, numero: e.target.value })} />
               <input placeholder="Bairro" style={{...inputStyle, flex: 2}} onChange={(e) => setCliente({ ...cliente, bairro: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
               <input placeholder="Cidade" style={{...inputStyle, flex: 2}} onChange={(e) => setCliente({ ...cliente, cidade: e.target.value })} />
               <input placeholder="Estado" style={{...inputStyle, flex: 1}} onChange={(e) => setCliente({ ...cliente, estado: e.target.value })} />
            </div>
            <input placeholder="Digite o nome do canto" style={inputStyle} onChange={(e) => setCliente({ ...cliente, canto: e.target.value })} />
            
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={calcularFrete} style={btnSecondary}>Calcular Frete</button>
              <button onClick={comprar} style={btnPrimary}>Compra segura</button>
            </div>
          </div>

          <h3 style={{ marginTop: "20px" }}>
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>
      </div>

      {/* BOTÃO WHATSAPP FIXO NO RODAPÉ */}
      <a 
        href={`https://wa.me/5581993414930?text=Olá, tenho interesse no produto: ${produto.nome}`}
        target="_blank"
        rel="noopener noreferrer"
        style={whatsappBtn}
      >
        Falar no WhatsApp
      </a>
    </div>
  );
}

// ESTILOS SIMPLES PARA MANTER A ORGANIZAÇÃO
const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "4px" };
const btnPrimary = { padding: "12px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" };
const btnSecondary = { padding: "12px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", cursor: "pointer" };
const whatsappBtn = {
  position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
  backgroundColor: "#25d366", color: "white", padding: "15px 60px", borderRadius: "5px",
  textDecoration: "none", fontWeight: "bold", width: "90%", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
};