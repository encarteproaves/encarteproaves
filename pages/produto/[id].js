import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // Verifique se este caminho está correto

export default function Produto() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState(null);

  const [cliente, setCliente] = useState({
    nome: "",
    telefone: "",
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

  // =============================
  // BUSCAR PRODUTO DIRETO NO SUPABASE
  // =============================
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
        console.error("Erro ao buscar produto:", err);
        setErro("Produto não encontrado.");
      }
    }

    carregarProduto();
  }, [id]);

  // =============================
  // CALCULAR FRETE
  // =============================
  const calcularFrete = async () => {
    if (!cliente.cep) {
      alert("Digite o CEP");
      return;
    }

    try {
      const res = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: cliente.cep,
          produtoId: produto.id
        })
      });

      const data = await res.json();

      if (!data || !Array.isArray(data)) {
        alert("Erro ao calcular frete");
        return;
      }

      setFretes(data);

      if (data.length > 0) {
        setFreteSelecionado(data[0]);
        setTotal(Number(produto.preco) + Number(data[0].price || data[0].valor || 0));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao calcular frete");
    }
  };

  // =============================
  // COMPRA SEGURA
  // =============================
  const comprar = async () => {
    try {
      if (!cliente.nome || !cliente.telefone || !cliente.cep) {
        alert("Preencha nome, telefone e CEP");
        return;
      }

      if (!freteSelecionado) {
        alert("Selecione um frete");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: cliente.nome, // Nome ajustado para o que a API espera
          customerEmail: `${cliente.telefone}@temp.com`, // Email provisório se não houver campo
          phoneNumber: cliente.telefone,
          shippingCep: cliente.cep,
          shippingCost: Number(freteSelecionado.price || freteSelecionado.valor || 0),
          items: [{
            id: produto.id,
            name: produto.nome,
            price: Number(produto.preco),
            quantity: 1
          }]
        })
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar pagamento");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao processar pagamento");
    }
  };

  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  if (!produto) return <p>Carregando produto...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{produto.nome}</h1>
      <h2 style={{ color: "green" }}>R$ {Number(produto.preco).toFixed(2)}</h2>
      <p>{produto.descricao}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <input placeholder="Nome Completo" onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
        <input placeholder="WhatsApp (DDD + Número)" onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} />
        <input placeholder="CEP" onChange={(e) => setCliente({ ...cliente, cep: e.target.value })} />
        <button onClick={calcularFrete} style={{ padding: "10px", cursor: "pointer" }}>Calcular Frete</button>
        
        {fretes.length > 0 && (
          <div style={{ border: "1px solid #ccc", padding: "10px" }}>
            {fretes.map((f, i) => (
              <label key={i} style={{ display: "block", marginBottom: "5px" }}>
                <input type="radio" name="frete" onChange={() => setFreteSelecionado(f)} checked={freteSelecionado === f} />
                {f.nome} - R$ {Number(f.price || f.valor).toFixed(2)} ({f.prazo} dias)
              </label>
            ))}
          </div>
        )}

        <h3>Total: R$ {total.toFixed(2)}</h3>
        <button onClick={comprar} style={{ padding: "15px", backgroundColor: "#28a745", color: "white", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          FINALIZAR COMPRA SEGURA
        </button>
      </div>
    </div>
  );
}