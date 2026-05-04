import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Produto() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);

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
  // 🔥 CARREGAR PRODUTO (CORRIGIDO)
  // =============================
  useEffect(() => {
    if (!id) return;

    fetch(`/api/produtos?id=${id}`) // 🔥 AJUSTE AQUI
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProduto(data[0]);
          setTotal(Number(data[0].preco));
        } else {
          setProduto(data);
          setTotal(Number(data.preco));
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar produto:", err);
      });
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cep: cliente.cep,
          produtoId: id
        })
      });

      const data = await res.json();

      setFretes(data);

      if (data.length > 0) {
        setFreteSelecionado(data[0]);
        setTotal(Number(produto.preco) + Number(data[0].price));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao calcular frete");
    }
  };

  // =============================
  // ATUALIZAR TOTAL
  // =============================
  useEffect(() => {
    if (produto && freteSelecionado) {
      setTotal(Number(produto.preco) + Number(freteSelecionado.price));
    }
  }, [freteSelecionado]);

  // =============================
  // COMPRA SEGURA (FIX)
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: cliente.nome,
          telefone: cliente.telefone,
          cep: cliente.cep,
          endereco: cliente.endereco,
          numero: cliente.numero,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          estado: cliente.estado,
          canto: cliente.canto || "",

          produtoId: id,
          valorProduto: Number(produto.preco),

          frete: {
            nome: freteSelecionado.nome,
            price: Number(freteSelecionado.price),
            prazo: freteSelecionado.prazo
          }
        })
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error(data);
        alert("Erro ao gerar pagamento");
      }
    } catch (error) {
      console.error(error);
      alert("Erro no checkout");
    }
  };

  // =============================
  // LOADING
  // =============================
  if (!produto) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{produto.nome}</h1>
      <h2>R$ {Number(produto.preco).toFixed(2)}</h2>

      <p>{produto.descricao}</p>

      <br />

      <input placeholder="CEP" onChange={(e) => setCliente({ ...cliente, cep: e.target.value })} />
      <input placeholder="Nome" onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
      <input placeholder="Telefone" onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} />
      <input placeholder="Endereço" onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })} />
      <input placeholder="Número" onChange={(e) => setCliente({ ...cliente, numero: e.target.value })} />
      <input placeholder="Bairro" onChange={(e) => setCliente({ ...cliente, bairro: e.target.value })} />
      <input placeholder="Cidade" onChange={(e) => setCliente({ ...cliente, cidade: e.target.value })} />
      <input placeholder="Estado" onChange={(e) => setCliente({ ...cliente, estado: e.target.value })} />
      <input placeholder="Digite o canto" onChange={(e) => setCliente({ ...cliente, canto: e.target.value })} />

      <br /><br />

      <button onClick={calcularFrete}>Calcular Frete</button>
      <button onClick={comprar}>Compra segura</button>

      <br /><br />

      {fretes.map((f, i) => (
        <div key={i}>
          <input
            type="radio"
            name="frete"
            onChange={() => setFreteSelecionado(f)}
          />
          {f.nome} - R$ {f.price}
        </div>
      ))}

      <h3>Total: R$ {total.toFixed(2)}</h3>
    </div>
  );
}