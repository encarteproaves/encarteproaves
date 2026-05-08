import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProdutoPage() {
  const router = useRouter();
  const { id } = router.query;

  // ESTADOS DO PRODUTO E INTERFACE
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  // ESTADOS PARA FRETE E CLIENTE
  const [cliente, setCliente] = useState({});
  const [fretes, setFretes] = useState([]); // 1º ITEM: MOSTRAR OPÇÕES DE FRETE
  const [freteSelecionado, setFreteSelecionado] = useState(null); // 3º ITEM: ESCOLHER FRETE
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [cepErro, setCepErro] = useState(false);

  // BLOCO: BUSCA DADOS DO PRODUTO
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

  // BLOCO: BUSCA ENDEREÇO PELO CEP
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
        }
      } catch (err) { console.error(err); }
    }
    buscarCep();
  }, [cliente.cep]);

  function handleChange(campo, valor) {
    setCliente((prev) => ({ ...prev, [campo]: valor }));
  }

  // BLOCO: 1º E 2º ITEM (MOSTRAR TRANSPORTADORAS E OPÇÕES)
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
      const lista = Array.isArray(data) ? data : (data.options || []);
      setFretes(lista);
    } catch (err) {
      alert("Erro ao calcular frete");
    } finally {
      setLoadingFrete(false);
    }
  }

  // BLOCO: 4º ITEM (SOMAR TOTAL PRODUTO + FRETE)
  const valorProduto = Number(produto?.preco || 0);
  const valorFrete = Number(freteSelecionado?.price || freteSelecionado?.cost || 0);
  const total = valorProduto + valorFrete;

  async function comprar() {
    if (!cliente.nome || !cliente.cep || !freteSelecionado) {
      return alert("Preencha seus dados e escolha o frete");
    }
    // Lógica de checkout aqui...
    alert("Iniciando pagamento de " + total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));
  }

  if (loading) return <p style={{textAlign: "center", padding: "50px"}}>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.imgContainer}>
          <img src={produto.imagem} style={styles.img} alt={produto.nome} />
        </div>

        <div style={{ flex: 1, minWidth: "320px" }}>
          <h1>{produto.nome}</h1>
          <h2 style={{ color: "green" }}>{valorProduto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h2>
          
          <div style={styles.descricao}>{produto.descricao_completa || produto.descricao}</div>

          <div style={styles.form}>
            <input placeholder="Seu CEP" style={styles.input} onChange={(e) => handleChange("cep", e.target.value)} />
            <input placeholder="Seu Nome" style={styles.input} onChange={(e) => handleChange("nome", e.target.value)} />
            <input placeholder="Endereço" style={styles.input} value={cliente.endereco || ""} readOnly />
            <button style={styles.btnCalcular} onClick={calcularFrete}>
              {loadingFrete ? "Calculando..." : "Calcular Frete"}
            </button>
          </div>

          {/* 1º E 2º ITEM: LISTA DE TRANSPORTADORAS */}
          {fretes.length > 0 && (
            <div style={styles.freteBox}>
              <p><strong>Escolha a entrega:</strong></p>
              {fretes.map((f, i) => (
                <label key={i} style={styles.freteItem}>
                  <input type="radio" name="frete" onChange={() => setFreteSelecionado(f)} />
                  <span>{f.name} - R$ {Number(f.price || f.cost).toFixed(2)}</span>
                </label>
              ))}
            </div>
          )}

          {/* 4º ITEM: TOTAL SOMADO */}
          <h3 style={{ marginTop: "20px" }}>
            Total: {total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
          </h3>

          <button style={styles.btnComprar} onClick={comprar}>Comprar Agora</button>
        </div>
      </div>
    </div>
  );
}

// ESTILOS DEFINIDOS PARA EVITAR O ERRO DE CLIENT-SIDE EXCEPTION
const styles = {
  container: { padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" },
  card: { display: "flex", gap: "30px", flexWrap: "wrap" },
  imgContainer: { flex: "1", minWidth: "300px" },
  img: { width: "100%", borderRadius: "10px" },
  descricao: { margin: "20px 0", color: "#666", lineHeight: "1.5", whiteSpace: "pre-line" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "5px" },
  btnCalcular: { padding: "10px", cursor: "pointer", background: "#eee", border: "1px solid #ccc" },
  freteBox: { marginTop: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" },
  freteItem: { display: "flex", gap: "10px", marginBottom: "8px", cursor: "pointer" },
  btnComprar: { width: "100%", padding: "15px", background: "#000", color: "#fff", border: "none", borderRadius: "5px", marginTop: "20px", cursor: "pointer", fontWeight: "bold" }
};