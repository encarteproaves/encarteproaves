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
  const [quantidade, setQuantidade] = useState(1); // <-- NOVO: Estado para a quantidade
  const [fretes, setFretes] = useState([]);
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [cepErro, setCepErro] = useState(false);
  const [nomeDoCanto, setNomeDoCanto] = useState("");
const [variacao, setVariacao] = useState("Malha Fina"); // <-- NOVO: Estado para a malha do bebedouro
  // Funções para manipular a quantidade
  const aumentarQtde = () => setQuantidade(q => q + 1);
  const diminuirQtde = () => setQuantidade(q => Math.max(1, q - 1));

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
        loading && setLoading(false);
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

  // 4. CÁLCULO DE FRETE (Envia quantidade para calcular peso total no back-end)
  async function calcularFrete() {
    if (!cliente.cep) return alert("Digite o CEP");
    setLoadingFrete(true);
    setFretes([]);

    try {
      const res = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cep: cliente.cep, 
          produtoId: produto.id,
          quantidade: quantidade // <-- NOVO: Enviando a quantidade para calcular o peso dinâmico
        }),
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

  // CÁLCULO DO TOTAL (Multiplicando o produto pela quantidade)
  const valorUnitario = Number(produto?.preco || 0);
  const valorProdutoTotal = valorUnitario * quantidade; // <-- VALOR MULTIPLICADO
  const valorFrete = Number(freteSelecionado?.price || freteSelecionado?.cost || 0);
  const total = valorProdutoTotal + valorFrete;

  // FUNÇÃO DE COMPRA REAL (REDIRECIONA PARA MERCADO PAGO COM MULTI-UNIDADES)
  async function comprar() {
    if (!cliente.nome || !cliente.telefone || !cliente.cep || !freteSelecionado) {
      return alert("Preencha todos os dados e selecione o frete!");
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto: { id: produto.id, nome: produto.nome, preco: valorUnitario },
          quantidade: quantity,
          cliente: { ...cliente, canto: nomeDoCanto },
          variacao: produto?.nome?.toLowerCase().includes("bebedouro") || produto?.nome?.includes("Bebedouro") ? variacao : null, // <-- NOVO
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
      `Olá! Tenho interesse no produto: ${produto?.nome} (${quantidade}x un).${infoCanto}\n\n*Resumo do Pedido:*\nProduto (${quantidade}x): ${valorProdutoTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}\nFrete: ${valorFrete.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}\n*Total: ${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}*`
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
            {valorUnitario.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} <span style={{fontSize: "14px", color: "#666", fontWeight: "normal"}}>cada</span>
          </h2>
          
          <div style={styles.descricao}>{produto.descricao_completa || produto.descricao}</div>

          <div style={styles.form}>
            
            {/* NOVO: SELETOR VISUAL DE QUANTIDADE */}
            <div style={styles.seletorContainer}>
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>Selecione a quantidade:</span>
              <div style={styles.seletorBotoesBox}>
                <button type="button" onClick={diminuirQtde} style={styles.btnMenos}>-</button>
                <span style={styles.txtQuantidade}>{quantidade}</span>
                <button type="button" onClick={aumentarQtde} style={styles.btnMais}>+</button>
              </div>
            </div>

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
{/* CAMPO PERSONALIZADO PARA BEBEDOUROS */}
            {(produto?.nome?.toLowerCase().includes("bebedouro") || produto?.nome?.includes("Bebedouro")) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px 5px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: "#000" }}>Escolha a malha da gaiola:</span>
                <div style={{ display: "flex", gap: "20px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#000", fontWeight: "500" }}>
                    <input type="radio" name="malha" value="Malha Fina" checked={variacao === "Malha Fina"} onChange={(e) => setVariacao(e.target.value)} />
                    Malha Fina
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#000", fontWeight: "500" }}>
                    <input type="radio" name="malha" value="Malha Larga" checked={variacao === "Malha Larga"} onChange={(e) => setVariacao(e.target.value)} />
                    Malha Larga
                  </label>
                </div>
              </div>
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
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Subtotal dos Produtos: {valorProdutoTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Valor Total Final (com frete):</p>
            <h3 style={{ fontSize: "24px", color: "#000" }}>
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

// Substitua o objeto const styles que está no fim do seu arquivo por este:
const styles = {
  container: { 
    padding: "30px 20px", 
    maxWidth: "1100px", 
    margin: "0 auto", 
    fontFamily: "system-ui, -apple-system, sans-serif", // Fonte mais moderna e nítida
    color: "#1a1a1a" // Preto nítido no container geral
  },
  card: { 
    display: "flex", 
    gap: "40px", 
    flexWrap: "wrap", 
    backgroundColor: "#fff" 
  },
  imgContainer: { 
    flex: "1", 
    minWidth: "300px" 
  },
  img: { 
    width: "100%", 
    borderRadius: "10px", 
    boxShadow: "0 6px 15px rgba(0,0,0,0.12)" // Sombra levemente mais marcada para destacar a foto
  },
  descricao: { 
    margin: "25px 0", 
    color: "#222222", // Saída do cinza fosco para um preto suave e muito nítido
    lineHeight: "1.7", // Mais espaçamento entre linhas para ajudar a leitura
    whiteSpace: "pre-line", 
    fontSize: "16px", // Aumentado levemente de 15px para 16px
    fontWeight: "400"
  },
  form: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "14px",
    padding: "20px",
    border: "2px solid #b5b5b5", // Linha de contorno do formulário bem visível
    borderRadius: "8px",
    backgroundColor: "#fafafa"
  },
  
  // SELETOR DE QUANTIDADE
  seletorContainer: { 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "between", 
    gap: "15px", 
    padding: "12px 15px", 
    background: "#f1f3f5", 
    borderRadius: "6px", 
    border: "2px solid #868e96" // Borda do seletor mais nítida
  },
  seletorBotoesBox: { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    marginLeft: "auto" 
  },
  btnMenos: { 
    width: "38px", 
    height: "38px", 
    cursor: "pointer", 
    background: "#e2e8f0", 
    border: "1px solid #cbd5e1", 
    borderRadius: "5px", 
    fontSize: "20px", 
    fontWeight: "bold",
    color: "#000"
  },
  btnMais: { 
    width: "38px", 
    height: "38px", 
    cursor: "pointer", 
    background: "#000", 
    color: "#fff", 
    border: "none", 
    borderRadius: "5px", 
    fontSize: "20px", 
    fontWeight: "bold" 
  },
  txtQuantidade: { 
    fontSize: "18px", 
    fontWeight: "bold", 
    minWidth: "25px", 
    textAlign: "center",
    color: "#000"
  },

  input: { 
    padding: "14px", 
    border: "2px solid #94a3b8", // Borda dos inputs reforçada (não fica sumindo no fundo)
    borderRadius: "6px", 
    width: "100%", 
    boxSizing: "border-box", 
    fontSize: "15px",
    color: "#000",
    backgroundColor: "#fff"
  },
  btnCalcular: { 
    padding: "14px", 
    cursor: "pointer", 
    background: "#e2e8f0", 
    border: "2px solid #cbd5e1", 
    fontWeight: "bold", 
    borderRadius: "6px", 
    fontSize: "15px",
    color: "#000",
    transition: "0.2s" 
  },
  freteBox: { 
    marginTop: "20px", 
    padding: "15px", 
    border: "2px solid #000", // Caixa de frete com contorno preto nítido para chamar atenção
    borderRadius: "8px", 
    background: "#f8fafc" 
  },
  freteLabel: { 
    display: "flex", 
    gap: "10px", 
    marginBottom: "12px", 
    cursor: "pointer", 
    alignItems: "center",
    color: "#1a1a1a"
  },
  btnComprar: { 
    width: "100%", 
    padding: "18px", 
    background: "#000", 
    color: "#fff", 
    border: "none", 
    borderRadius: "6px", 
    marginTop: "25px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    fontSize: "18px", // Botão de compra ligeiramente maior e mais imponente
    transition: "0.3s" 
  },
  btnWhats: {
    width: "100%", 
    padding: "15px", 
    backgroundColor: "#25D366", 
    color: "#fff", 
    border: "none", 
    borderRadius: "6px", 
    marginTop: "12px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    fontSize: "16px", 
    textAlign: "center", 
    transition: "0.3s"
  }
};