import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function ProdutoPerfil() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [variacao, setVariacao] = useState("Malha Fina"); // Valor padrão para bebedouros
  const [carregando, setCarregando] = useState(true);

  // Estados do Formulário de Entrega
  const [cep, setCep] = useState("");
  const [nome_cliente, setNomeCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // Estados de Frete
  const [opcoesFrete, setOpcoesFrete] = useState([]);
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState("");

  // Busca os dados do produto no Supabase
  useEffect(() => {
    if (!id) return;
    async function fetchProduto() {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar produto:", error);
      } else {
        setProduto(data);
      }
      setCarregando(false);
    }
    fetchProduto();
  }, [id]);

  if (carregando) {
    return <div style={{ textItems: "center", padding: "50px" }}>Carregando produto...</div>;
  }

  if (!produto) {
    return <div style={{ textItems: "center", padding: "50px" }}>Produto não encontrado.</div>;
  }

  // Definição de Valores Financeiros
  const valorUnitario = Number(produto.preco) || 0;
  const valorProdutoTotal = valorUnitario * quantidade;
  const valorFrete = freteSelecionado ? Number(freteSelecionado.price) : 0;
  const total = valorProdutoTotal + valorFrete;

  // Verifica se o produto atual é um bebedouro (normal ou automático)
  const ehBebedouro = 
    produto?.nome?.toLowerCase().includes("bebedouro") || 
    produto?.nome?.includes("Bebedouro");

  // Função para buscar o endereço via CEP
  async function buscarCep() {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      alert("Por favor, digite um CEP válido com 8 dígitos.");
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        alert("CEP não encontrado.");
      } else {
        setEndereco(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setEstado(data.uf || "");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  }

  // Função para calcular as opções de frete baseadas no peso total
  async function calcularFrete() {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      alert("Digite o CEP antes de calcular o frete.");
      return;
    }

    setCalculandoFrete(true);
    setErroFrete("");
    setOpcoesFrete([]);
    setFreteSelecionado(null);

    try {
      const response = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cepDestino: cepLimpo,
          // Múltipla o peso unitário do produto pela quantidade selecionada
          pesoTotal: (Number(produto.peso) || 0.3) * quantidade,
        }),
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        // Filtra apenas as transportadoras válidas e que retornaram preço
        const fretesValidos = data.filter(f => f.price && !f.error);
        setOpcoesFrete(fretesValidos);
        if (fretesValidos.length > 0) {
          setFreteSelecionado(fretesValidos[0]); // Seleciona o primeiro como padrão
        }
      } else {
        setErroFrete(data.error || "Não foi possível calcular o frete para este CEP.");
      }
    } catch (err) {
      setErroFrete("Erro de conexão ao calcular o frete.");
    } finally {
      setCalculandoFrete(false);
    }
  }

  // Função para enviar o pedido à API de Checkout (Mercado Pago + Supabase)
  async function comprar() {
    if (!nome_cliente || !telefone || !cpf || !cep || !endereco || !numero || !cidade) {
      alert("Por favor, preencha todos os campos do formulário de entrega.");
      return;
    }

    if (!freteSelecionado) {
      alert("Por favor, calcule e selecione uma opção de frete.");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto: { id: produto.id, nome: produto.nome, preco: valorUnitario },
          quantidade: quantidade,
          variacao: ehBebedouro ? variacao : null, // Envia a malha apenas se for bebedouro
          cliente: {
            nome_cliente,
            telefone,
            cpf,
            cep,
            endereco,
            numero,
            bairro,
            cidade,
            estado
          },
          frete: freteSelecionado
        }),
      });

      const data = await response.json();

      if (response.ok && data.init_point) {
        // Redireciona o cliente diretamente para o Mercado Pago
        window.location.href = data.init_point;
      } else {
        alert(data.error || "Erro ao gerar link de pagamento. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro no checkout:", err);
      alert("Erro de conexão. Tente novamente.");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* LADO ESQUERDO: Imagem e Descrição */}
        <div>
          <img src={produto.imagem_url} alt={produto.nome} style={styles.imagem} />
          <h1 style={styles.titulo}>{produto.nome}</h1>
          <p style={styles.descricao}>{produto.descricao}</p>
        </div>

        {/* LADO DIREITO: Painel de Compra e Formulários */}
        <div style={styles.painelCompra}>
          <div style={styles.precoContainer}>
            <span style={styles.labelPreco}>Preço Unitário:</span>
            <span style={styles.preco}>
              {valorUnitario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>

          {/* CONTROLE DE QUANTIDADE */}
          <div style={styles.quantidadeContainer}>
            <span style={{ fontWeight: "bold" }}>Selecione a quantidade:</span>
            <div style={{ display: "flex", items: "center", gap: "10px" }}>
              <button onClick={() => setQuantidade(q => Math.max(1, q - 1))} style={styles.btnQuant}>-</button>
              <span style={{ fontSize: "18px", fontWeight: "bold", width: "20px", textItems: "center" }}>{quantidade}</span>
              <button onClick={() => setQuantidade(q => q + 1)} style={styles.btnQuant}>+</button>
            </div>
          </div>

          {/* SELETOR DE VARIAÇÃO (Aparece dinamicamente se for bebedouro) */}
          {ehBebedouro && (
            <div style={styles.variacaoContainer}>
              <span style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px", display: "block" }}>
                Escolha o modelo da malha da gaiola:
              </span>
              <div style={{ display: "flex", gap: "15px" }}>
                <label style={{ ...styles.variacaoLabel, border: variacao === "Malha Fina" ? "2px solid #000" : "1px solid #ccc", background: variacao === "Malha Fina" ? "#f1f3f5" : "#fff" }}>
                  <input 
                    type="radio" 
                    name="malha" 
                    value="Malha Fina" 
                    checked={variacao === "Malha Fina"} 
                    onChange={(e) => setVariacao(e.target.value)} 
                    style={{ marginRight: "8px", cursor: "pointer" }}
                  />
                  <strong>Malha Fina</strong>
                </label>
                
                <label style={{ ...styles.variacaoLabel, border: variacao === "Malha Larga" ? "2px solid #000" : "1px solid #ccc", background: variacao === "Malha Larga" ? "#f1f3f5" : "#fff" }}>
                  <input 
                    type="radio" 
                    name="malha" 
                    value="Malha Larga" 
                    checked={variacao === "Malha Larga"} 
                    onChange={(e) => setVariacao(e.target.value)} 
                    style={{ marginRight: "8px", cursor: "pointer" }}
                  />
                  <strong>Malha Larga</strong>
                </label>
              </div>
            </div>
          )}

          {/* FORMULÁRIO DE ENTREGA */}
          <div style={styles.form}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={buscarCep} style={styles.input} />
              <button onClick={calcularFrete} style={styles.btnSecundario}>Calcular Frete</button>
            </div>

            <input type="text" placeholder="Seu Nome Completo" value={nome_cliente} onChange={(e) => setNomeCliente(e.target.value)} style={styles.input} />
            <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={styles.input} />
            <input type="text" placeholder="CPF (Para a nota de envio)" value={cpf} onChange={(e) => setCpf(e.target.value)} style={styles.input} />
            <input type="text" placeholder="Endereço / Rua" value={endereco} onChange={(e) => setEndereco(e.target.value)} style={styles.input} />
            
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="Nº" value={numero} onChange={(e) => setNumero(e.target.value)} style={{ ...styles.input, width: "30%" }} />
              <input type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} style={{ ...styles.input, width: "70%" }} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} style={{ ...styles.input, width: "70%" }} />
              <input type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} style={{ ...styles.input, width: "30%" }} />
            </div>
          </div>

          {/* LISTA DE OPÇÕES DE FRETE RETORNADAS */}
          {calculandoFrete && <p style={{ color: "#666" }}>Calculando opções de logística...</p>}
          {erroFrete && <p style={{ color: "red", fontSize: "14px" }}>{erroFrete}</p>}

          {opcoesFrete.length > 0 && (
            <div style={styles.freteBox}>
              <span style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Selecione a entrega:</span>
              {opcoesFrete.map((f) => (
                <label key={f.id} style={styles.freteItem}>
                  <input 
                    type="radio" 
                    name="frete_opcao" 
                    checked={freteSelecionado?.id === f.id} 
                    onChange={() => setFreteSelecionado(f)} 
                  />
                  <span style={{ marginLeft: "8px", flex: 1 }}>{f.name} ({f.deadline} dias)</span>
                  <strong>{Number(f.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                </label>
              ))}
            </div>
          )}

          {/* RESUMO DE VALORES */}
          <div style={styles.resumo}>
            <p>Subtotal do Produto: {valorProdutoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p>Custo de Envio: {valorFrete > 0 ? valorFrete.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Calcule o CEP"}</p>
            <h3 style={{ marginTop: "10px" }}>Total Final: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h3>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <button onClick={comprar} style={styles.btnPrincipal}>Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
}

// OBJETO DE ESTILOS CSS-IN-JS
const styles = {
  container: { maxWidth: "1100px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "20px" },
  imagem: { width: "100%", borderRadius: "8px", objectFit: "cover", maxHeight: "450px" },
  titulo: { fontSize: "28px", fontWeight: "bold", marginTop: "15px" },
  descricao: { color: "#4a5568", marginTop: "10px", lineHeight: "1.6" },
  painelCompra: { border: "1px solid #e2e8f0", padding: "25px", borderRadius: "8px", backgroundColor: "#fff" },
  precoContainer: { display: "flex", justifyContent: "space-between", items: "center", marginBottom: "20px" },
  labelPreco: { fontSize: "16px", color: "#4a5568" },
  preco: { fontSize: "24px", fontWeight: "bold", color: "#000" },
  quantidadeContainer: { display: "flex", justifyContent: "space-between", items: "center", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "6px", marginBottom: "15px" },
  btnQuant: { width: "30px", height: "30px", border: "1px solid #000", background: "#fff", cursor: "pointer", fontWeight: "bold", borderRadius: "4px" },
  variacaoContainer: { padding: "15px", background: "#f8fafc", borderRadius: "6px", border: "2px solid #cbd5e1", marginBottom: "15px" },
  variacaoLabel: { flex: 1, display: "flex", items: "center", justifyContent: "center", padding: "12px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", transition: "0.2s" },
  form: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" },
  input: { padding: "10px", border: "1px solid #cbd5e1", borderRadius: "5px", fontSize: "14px", width: "100%", boxSizing: "border-box" },
  btnSecundario: { padding: "10px 15px", background: "#f1f3f5", border: "1px solid #000", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" },
  freteBox: { background: "#f8fafc", border: "1px solid #e2e8f0", padding: "15px", borderRadius: "6px", marginTop: "15px" },
  freteItem: { display: "flex", items: "center", padding: "10px", borderBottom: "1px solid #edf2f7", cursor: "pointer" },
  resumo: { marginTop: "20px", padding: "15px", borderTop: "2px dashed #e2e8f0", color: "#2d3748" },
  btnPrincipal: { width: "100%", padding: "15px", background: "#000", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "15px", transition: "0.2s" }
};