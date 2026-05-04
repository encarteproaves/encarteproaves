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
// ==========================================
  // BUSCA E VALIDAÇÃO DE CEP
  // ==========================================
  const buscarEndereco = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    
    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();
        
        if (data.erro) {
          alert("CEP inválido! Por favor, confira os números digitados.");
          setCliente((prev) => ({
            ...prev,
            cep: "",
            endereco: "",
            bairro: "",
            cidade: "",
            estado: ""
          }));
          return;
        }

        setCliente((prev) => ({
          ...prev,
          cep: cepLimpo,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
        
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
        alert("Erro ao consultar o CEP. Tente novamente mais tarde.");
      }
    }
  };
  // BUSCA DE DADOS
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
        console.error("Erro Supabase:", err);
        setErro("Produto não encontrado.");
      }
    }
    carregarProduto();
  }, [id]);

  // ATUALIZAÇÃO DE TOTAL
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
      if (Array.isArray(data)) {
        setFretes(data);
        if (data.length > 0) setFreteSelecionado(data[0]);
      }
    } catch (err) {
      alert("Erro ao calcular frete");
    }
  };

  const comprar = async () => {
    if (!cliente.nome || !cliente.telefone || !cliente.cep || !cliente.cpf) {
      return alert("Preencha todos os campos obrigatórios (Nome, Telefone, CPF, CEP)");
    }
    if (!freteSelecionado) return alert("Por favor, calcule e selecione o frete");

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
      alert("Erro ao processar checkout");
    }
  };

  if (erro) return <div style={{padding: "50px", textAlign: "center"}}>{erro}</div>;
  if (!produto) return <div style={{padding: "50px", textAlign: "center"}}>Carregando...</div>;

  const ehPenDrive = produto.nome.toLowerCase().includes("pen drive");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto", paddingBottom: "120px" }}>
      
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* IMAGEM (ESQUERDA) */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <img src={produto.imagem} alt={produto.nome} style={{ width: "100%", borderRadius: "8px" }} />
        </div>

        {/* CONTEÚDO (DIREITA) */}
        <div style={{ flex: "1.2", minWidth: "320px" }}>
          <h1 style={{ fontSize: "28px", margin: "0 0 10px 0" }}>{produto.nome}</h1>
          <div style={{ color: "#28a745", fontSize: "32px", fontWeight: "bold", marginBottom: "5px" }}>
            {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          
          {produto.estoque > 0 && (
            <p style={{ color: "red", fontWeight: "bold", fontSize: "14px", marginBottom: "15px" }}>
              Restam apenas {produto.estoque} unidades
            </p>
          )}
          
          {/* DESCRIÇÃO COMPLETA - Agora puxando da coluna correta do seu print 1413 */}
<div style={{ whiteSpace: "pre-wrap", color: "#333", lineHeight: "1.6", fontSize: "15px", marginBottom: "25px" }}>
  {produto.descricao_completa || produto.descricao}
</div>

          {/* FORMULÁRIO COMPLETO */}
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  <input 
    placeholder="Digite seu CEP" 
    style={inputStyle} 
    value={cliente.cep}
    onChange={(e) => {
      const val = e.target.value;
      setCliente({...cliente, cep: val});
      buscarEndereco(val); // <--- Isso ativa a busca automática
    }} 
  />
  <input placeholder="Seu nome" style={inputStyle} value={cliente.nome} onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
  <input placeholder="Telefone" style={inputStyle} value={cliente.telefone} onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} />
  <input placeholder="CPF" style={inputStyle} value={cliente.cpf} onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })} />
  
  {/* O value={cliente.endereco} abaixo permite que o texto apareça sozinho */}
  <input placeholder="Endereço" style={inputStyle} value={cliente.endereco} onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })} />
  
  <div style={{ display: "flex", gap: "10px" }}>
     <input placeholder="Número" style={{...inputStyle, flex: 1}} value={cliente.numero} onChange={(e) => setCliente({ ...cliente, numero: e.target.value })} />
     <input placeholder="Bairro" style={{...inputStyle, flex: 2}} value={cliente.bairro} onChange={(e) => setCliente({ ...cliente, bairro: e.target.value })} />
  </div>
  
  <div style={{ display: "flex", gap: "10px" }}>
     <input placeholder="Cidade" style={{...inputStyle, flex: 2}} value={cliente.cidade} onChange={(e) => setCliente({ ...cliente, cidade: e.target.value })} />
     <input placeholder="Estado" style={{...inputStyle, flex: 1}} value={cliente.estado} onChange={(e) => setCliente({ ...cliente, estado: e.target.value })} />
  </div>
</div>
            {/* CAMPO CONDICIONAL */}
            {ehPenDrive && (
              <input 
                placeholder="Digite o nome do canto" 
                style={{...inputStyle, border: "2px solid #333"}} 
                onChange={(e) => setCliente({ ...cliente, canto: e.target.value })} 
              />
            )}
            
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={calcularFrete} style={btnSecondary}>Calcular Frete</button>
              <button onClick={comprar} style={btnPrimary}>Compra segura</button>
            </div>
          </div>

          <div style={{ marginTop: "25px", fontSize: "22px", fontWeight: "bold", borderTop: "1px solid #eee", paddingTop: "15px" }}>
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>
      </div>

      {/* WHATSAPP FIXO */}
      <a 
        href={`https://wa.me/5581993414930?text=Olá, tenho interesse no produto: ${produto.nome}`}
        target="_blank" rel="noopener noreferrer" style={whatsappBtn}
      >
        Falar no WhatsApp
      </a>
    </div>
  );
}

const inputStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "5px", width: "100%", boxSizing: "border-box" };
const btnPrimary = { padding: "15px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1, borderRadius: "5px" };
const btnSecondary = { padding: "15px", backgroundColor: "#fff", border: "1px solid #000", cursor: "pointer", fontWeight: "bold", flex: 1, borderRadius: "5px" };
const whatsappBtn = {
  position: "fixed", bottom: "0", left: "0", width: "100%",
  backgroundColor: "#25d366", color: "white", padding: "20px",
  textDecoration: "none", fontWeight: "bold", textAlign: "center", fontSize: "18px", zIndex: 1000
};