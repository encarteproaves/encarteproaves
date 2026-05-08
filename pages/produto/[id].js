import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProdutoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. ESTADOS (States)
  const [cliente, setCliente] = useState({
    nome: "", telefone: "", cpf: "", cep: "",
    endereco: "", numero: "", bairro: "", cidade: "", estado: ""
  });
  const [fretes, setFretes] = useState([]);
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [cepErro, setCepErro] = useState(false);
  const [nomeDoCanto, setNomeDoCanto] = useState("");

  // 2. BUSCA DADOS DO PRODUTO
  useEffect(() => {
    if (!id) return;
    async function fetchProduto() {
      try {
        const res = await fetch(`/api/produto?id=${id}`);
        const data = await res.json();
        setProduto(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduto();
  }, [id]);

  // 3. BUSCA ENDEREÇO PELO CEP
  useEffect(() => {
    const cepLimpo = cliente.cep?.replace(/\D/g, "");
    if (!cepLimpo || cepLimpo.length !== 8) return;

    async function buscarCep() {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCliente((prev) => ({
            ...prev,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
          setCepErro(false);
        } else {
          setCepErro(true);
        }
      } catch (err) { setCepErro(true); }
    }
    buscarCep();
  }, [cliente.cep]);

  function handleChange(campo, valor) {
    setCliente((prev) => ({ ...prev, [campo]: valor }));
  }

  // 4. CÁLCULO DE FRETE (Ordenado e Limitado)
  async function calcularFrete() {
    if (!cliente.cep) return alert("Digite o CEP");
    setLoadingFrete(true);
    setFretes([]);

    try {
      const res = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: cliente.cep, produtoId: produto.id }),
      });
      
      const data = await res.json();
      let listaFinal = Array.isArray(data) ? data : (data.options || []);

      // Filtra opções com erro e ordena por preço
      listaFinal = listaFinal
        .filter(f => !f.error)
        .sort((a, b) => Number(a.price || a.cost) - Number(b.price || b.cost));

      setFretes(listaFinal.slice(0, 6));
    } catch (err) {
      alert("Erro ao calcular frete. Verifique o CEP.");
    } finally {
      setLoadingFrete(false);
    }
  }

  // CÁLCULO DO TOTAL
  const valorProduto = Number(produto?.preco || 0);
  const valorFrete = Number(freteSelecionado?.price || freteSelecionado?.cost || 0);
  const total = valorProduto + valorFrete;

  // FUNÇÃO DE COMPRA REAL (REDIRECIONA PARA MERCADO PAGO)
  async function comprar() {
    if (!cliente.nome || !cliente.telefone || !cliente.cep || !freteSelecionado) {
      return alert("Preencha todos os dados e selecione o frete!");
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto: { id: produto.id, nome: produto.nome, preco: valorProduto },
          cliente: { ...cliente, canto: nomeDoCanto },
          frete: freteSelecionado
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar link de pagamento. Tente novamente.");
      }
    } catch (err) {
      alert("Erro na conexão com o checkout.");
    }
  }

  function falarWhatsapp() {
    const infoCanto = nomeDoCanto ? `\n*Canto solicitado:* ${nomeDoCanto}` : "";
    const mensagem = encodeURIComponent(
      `Olá! Tenho interesse no produto: ${produto?.nome}.${infoCanto}\n\n*Resumo do Pedido:*\nProduto: ${valorProduto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}\nFrete: ${valorFrete.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}\n*Total: ${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}*`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511984309480&text=${mensagem}`);
  }

  if (loading) return <p style={{textAlign: "center", padding: "50px"}}>Carregando produto...</p>;
  if (!produto) return <p style={{textAlign: "center", padding: "50px"}}>Produto não encontrado.</p>;
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.imgContainer}>
          <img src={produto.imagem} style={styles.img} alt={produto.nome} />
        </div>

        <div style={{ flex: 1.2, minWidth: "320px" }}>
          <h1 style={{ marginBottom: "10px" }}>{produto.nome}</h1>
          <h2 style={{ color: "#2d8a39", marginBottom: "20px" }}>
            {valorProduto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
          </h2>
          
          <div style={styles.descricao}>{produto.descricao_completa || produto.descricao}</div>

          <div style={styles.form}>
            <input placeholder="CEP" style={styles.input} value={cliente.cep || ""} onChange={(e) => handleChange("cep", e.target.value)} />
            {cepErro && <p style={{ color: "red", fontSize: "12px", marginTop: "-5px" }}>CEP não encontrado</p>}
            
            <input placeholder="Seu Nome Completo" style={styles.input} value={cliente.nome || ""} onChange={(e) => handleChange("nome", e.target.value)} />
            <input placeholder="Telefone" style={styles.input} value={cliente.telefone || ""} onChange={(e) => handleChange("telefone", e.target.value)} />
            <input placeholder="CPF" style={styles.input} value={cliente.cpf || ""} onChange={(e) => handleChange("cpf", e.target.value)} />
            <input placeholder="Endereço" style={styles.input} value={cliente.endereco || ""} onChange={(e) => handleChange("endereco", e.target.value)} />
            
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Nº" style={{...styles.input, flex: 1}} value={cliente.numero || ""} onChange={(e) => handleChange("numero", e.target.value)} />
              <input placeholder="Bairro" style={{...styles.input, flex: 2}} value={cliente.bairro || ""} onChange={(e) => handleChange("bairro", e.target.value)} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Cidade" style={{...styles.input, flex: 2, backgroundColor: "#f9f9f9"}} value={cliente.cidade || ""} readOnly />
              <input placeholder="Estado" style={{...styles.input, flex: 1, backgroundColor: "#f9f9f9"}} value={cliente.estado || ""} readOnly />
            </div>

            {/* CAMPO PERSONALIZADO PARA PEN DRIVE */}
            {produto?.nome?.toLowerCase().includes("pen drive") && (
              <input 
                placeholder="Qual canto deseja gravar no Pen Drive?" 
                style={{...styles.input, borderColor: "#25D366", borderWidth: "2px", backgroundColor: "#f0fff4"}} 
                value={nomeDoCanto} 
                onChange={(e) => setNomeDoCanto(e.target.value)} 
              />
            )}

            <button style={styles.btnCalcular} onClick={calcularFrete} disabled={loadingFrete}>
              {loadingFrete ? "Calculando..." : "Calcular Frete"}
            </button>
          </div>

          {fretes.length > 0 && (
            <div style={styles.freteBox}>
              <p style={{ marginBottom: "10px" }}><strong>Escolha a entrega:</strong></p>
              {fretes.map((f, i) => (
                <label key={i} style={styles.freteLabel}>
                  <input 
                    type="radio" 
                    name="frete" 
                    onChange={() => setFreteSelecionado(f)} 
                    style={{ cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "14px" }}>
                    {f.name} - <strong>R$ {Number(f.price || f.cost).toFixed(2)}</strong>
                  </span>
                </label>
              ))}
            </div>
          )}

          <div style={{ marginTop: "20px", borderTop: "2px solid #eee", paddingTop: "15px" }}>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Valor Final:</p>
            <h3 style={{ fontSize: "24px" }}>
              {total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
            </h3>
          </div>

          <button style={styles.btnComprar} onClick={comprar}>
            Finalizar Compra
          </button>
          
          <button style={styles.btnWhats} onClick={falarWhatsapp}>
            Dúvidas? Chame no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif", color: "#333" },
  card: { display: "flex", gap: "40px", flexWrap: "wrap", backgroundColor: "#fff" },
  imgContainer: { flex: "1", minWidth: "300px" },
  img: { width: "100%", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  descricao: { margin: "20px 0", color: "#555", lineHeight: "1.6", whiteSpace: "pre-line", fontSize: "15px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "12px", border: "1px solid #ccc", borderRadius: "5px", width: "100%", boxSizing: "border-box", fontSize: "14px" },
  btnCalcular: { padding: "14px", cursor: "pointer", background: "#f0f0f0", border: "1px solid #ccc", fontWeight: "bold", borderRadius: "5px", transition: "0.2s" },
  freteBox: { marginTop: "20px", padding: "15px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "#fcfcfc" },
  freteLabel: { display: "flex", gap: "10px", marginBottom: "12px", cursor: "pointer", alignItems: "center" },
  btnComprar: { 
    width: "100%", padding: "18px", background: "#000", color: "#fff", border: "none", 
    borderRadius: "5px", marginTop: "20px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", transition: "0.3s"
  },
  btnWhats: {
    width: "100%", padding: "15px", backgroundColor: "#25D366", color: "#fff", border: "none", 
    borderRadius: "5px", marginTop: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", textAlign: "center", transition: "0.3s"
  }
};