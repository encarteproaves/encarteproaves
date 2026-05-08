import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProdutoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  // ESTADOS PARA CLIENTE E FRETE
  const [cliente, setCliente] = useState({
    nome: "", telefone: "", cpf: "", cep: "",
    endereco: "", numero: "", bairro: "", cidade: "", estado: ""
  });
  const [fretes, setFretes] = useState([]);
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [cepErro, setCepErro] = useState(false);

  // BUSCA DADOS DO PRODUTO
  useEffect(() => {
    if (!id) return;
    async function fetchProduto() {
      try {
        const res = await fetch(`/api/produto?id=${id}`);
        const data = await res.json();
        setProduto(data);
      } catch (error) {
        console.error("Erro produto:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduto();
  }, [id]);

  // BUSCA ENDEREÇO PELO CEP (VIACEP)
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

  // CALCULAR FRETE, ORDENAR POR PREÇO E LIMITAR A 6 OPÇÕES
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

      // 1. Filtrar apenas opções que não tenham erro
      listaFinal = listaFinal.filter(f => !f.error);

      // 2. Ordenar do mais barato para o mais caro
      listaFinal.sort((a, b) => {
        const precoA = Number(a.price || a.cost || 0);
        const precoB = Number(b.price || b.cost || 0);
        return precoA - precoB;
      });

      // 3. Pegar apenas as 6 primeiras opções
      const top6Fretes = listaFinal.slice(0, 6);

      setFretes(top6Fretes);
    } catch (err) {
      alert("Erro ao calcular frete");
    } finally {
      setLoadingFrete(false);
    }
  }

  // SOMA TOTAL PRODUTO + FRETE
  const valorProduto = Number(produto?.preco || 0);
  const valorFrete = Number(freteSelecionado?.price || freteSelecionado?.cost || 0);
  const total = valorProduto + valorFrete;

  async function comprar() {
    if (!cliente.nome || !cliente.telefone || !cliente.cep || !freteSelecionado) {
      return alert("Preencha todos os dados e selecione o frete!");
    }
    alert("Redirecionando para pagamento...");
  }

  // FUNÇÃO WHATSAPP (LOGICA)
  function falarWhatsapp() {
    const mensagem = encodeURIComponent(
      `Olá, tenho interesse no produto ${produto?.nome}. O valor total com frete ficou em ${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511984309480&text=${mensagem}`);
  }

  if (loading) return <p style={{textAlign: "center", padding: "50px"}}>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.imgContainer}>
          <img src={produto.imagem} style={styles.img} alt={produto.nome} />
        </div>

        <div style={{ flex: 1.2, minWidth: "320px" }}>
          <h1>{produto.nome}</h1>
          <h2 style={{ color: "green" }}>{valorProduto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h2>
          
          <div style={styles.descricao}>{produto.descricao_completa || produto.descricao}</div>

          <div style={styles.form}>
            <input placeholder="CEP" style={styles.input} value={cliente.cep || ""} onChange={(e) => handleChange("cep", e.target.value)} />
            {cepErro && <p style={{ color: "red", fontSize: "12px" }}>CEP não encontrado</p>}
            
            <input placeholder="Seu Nome Completo" style={styles.input} value={cliente.nome || ""} onChange={(e) => handleChange("nome", e.target.value)} />
            <input placeholder="Telefone" style={styles.input} value={cliente.telefone || ""} onChange={(e) => handleChange("telefone", e.target.value)} />
            <input placeholder="CPF" style={styles.input} value={cliente.cpf || ""} onChange={(e) => handleChange("cpf", e.target.value)} />
            <input placeholder="Endereço" style={styles.input} value={cliente.endereco || ""} onChange={(e) => handleChange("endereco", e.target.value)} />
            
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Nº" style={{...styles.input, flex: 1}} value={cliente.numero || ""} onChange={(e) => handleChange("numero", e.target.value)} />
              <input placeholder="Bairro" style={{...styles.input, flex: 2}} value={cliente.bairro || ""} onChange={(e) => handleChange("bairro", e.target.value)} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Cidade" style={{...styles.input, flex: 2}} value={cliente.cidade || ""} readOnly />
              <input placeholder="Estado" style={{...styles.input, flex: 1}} value={cliente.estado || ""} readOnly />
            </div>

            <button style={styles.btnCalcular} onClick={calcularFrete}>
              {loadingFrete ? "Calculando..." : "Calcular Frete"}
            </button>
          </div>

          {fretes.length > 0 && (
            <div style={styles.freteBox}>
              <p><strong>Escolha a transportadora:</strong></p>
              {fretes.map((f, i) => (
                <label key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", cursor: "pointer", alignItems: "center" }}>
                  <input type="radio" name="frete" onChange={() => setFreteSelecionado(f)} />
                  <span>{f.name} - R$ {Number(f.price || f.cost).toFixed(2)}</span>
                </label>
              ))}
            </div>
          )}

          <h3 style={{ marginTop: "20px", borderTop: "2px solid #eee", paddingTop: "15px" }}>
            Total: {total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
          </h3>

          <button style={styles.btnComprar} onClick={comprar}>Finalizar Compra</button>
          
          <button style={styles.btnWhats} onClick={falarWhatsapp}>
            Dúvidas? Chame no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" },
  card: { display: "flex", gap: "40px", flexWrap: "wrap" },
  imgContainer: { flex: "1", minWidth: "300px" },
  img: { width: "100%", borderRadius: "10px" },
  descricao: { margin: "20px 0", color: "#444", lineHeight: "1.6", whiteSpace: "pre-line" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "12px", border: "1px solid #ccc", borderRadius: "5px", width: "100%", boxSizing: "border-box" },
  btnCalcular: { padding: "12px", cursor: "pointer", background: "#f0f0f0", border: "1px solid #ccc", fontWeight: "bold" },
  freteBox: { marginTop: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", background: "#fafafa" },
  btnComprar: { 
    width: "100%", padding: "18px", background: "#000", color: "#fff", border: "none", 
    borderRadius: "5px", marginTop: "20px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" 
  },
  btnWhats: {
    width: "100%", padding: "15px", backgroundColor: "#25D366", color: "#fff", border: "none", 
    borderRadius: "5px", marginTop: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", textAlign: "center"
  }
};