// ===============================
// IMPORTAÇÕES
// ===============================
// Importa o roteador do Next.js (para pegar parâmetros da URL)
import { useRouter } from "next/router";

// Importa hooks do React (estado e efeitos)
import { useEffect, useState } from "react";


// ===============================
// COMPONENTE PRINCIPAL DA PÁGINA
// ===============================
export default function ProdutoPage() {

  // ===============================
  // CAPTURA ID DO PRODUTO NA URL
  // ===============================
  const router = useRouter();
  const { id } = router.query;


  // ===============================
  // ESTADOS PRINCIPAIS
  // ===============================
  const [produto, setProduto] = useState(null); // Armazena dados do produto
  const [loading, setLoading] = useState(true); // Controle de carregamento

  const [cliente, setCliente] = useState({}); // Dados do cliente
  const [fretes, setFretes] = useState([]); // Lista de fretes disponíveis
  const [freteSelecionado, setFreteSelecionado] = useState(null); // Frete escolhido

  const [loadingFrete, setLoadingFrete] = useState(false); // Loading do frete
  const [cepErro, setCepErro] = useState(false); // Validação de CEP


  // ===============================
  // BUSCA PRODUTO AO CARREGAR PÁGINA
  // ===============================
  useEffect(() => {
    if (!id) return; // Só executa se tiver ID

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
  // ===============================
  // FIM BUSCA PRODUTO
  // ===============================


  // ===============================
  // BUSCA ENDEREÇO PELO CEP (VIACEP)
  // ===============================
  useEffect(() => {
    if (!cliente.cep || cliente.cep.length < 8) return;

    async function buscarCep() {
      try {
        const cepLimpo = cliente.cep.replace(/\D/g, "");

        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();

        // CEP inválido
        if (data.erro) {
          setCepErro(true);
          return;
        }

        setCepErro(false);

        // Preenche automaticamente endereço
        setCliente((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      } catch {
        setCepErro(true);
      }
    }

    buscarCep();
  }, [cliente.cep]);
  // ===============================
  // FIM BUSCA CEP
  // ===============================


  // ===============================
  // ATUALIZA CAMPOS DO FORMULÁRIO
  // ===============================
  function handleChange(campo, valor) {
    setCliente((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }
  // ===============================
  // FIM HANDLE CHANGE
  // ===============================


  // ===============================
  // CALCULAR FRETE
  // ===============================
  async function calcularFrete() {
    try {
      if (!cliente.cep) return alert("Digite o CEP");

      setLoadingFrete(true);

      const res = await fetch("/api/frete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cep: cliente.cep,
          produtoId: produto.id,
        }),
      });

      const data = await res.json();

      // Normaliza retorno
      let lista = data.options || data || [];

      // Remove fretes com valor inválido
      lista = lista.filter(
        (f) => Number(f.price || f.cost || f.valor || 0) > 0
      );

      // Ordena do mais barato para o mais caro
      lista.sort(
        (a, b) =>
          Number(a.price || a.cost || a.valor || 0) -
          Number(b.price || b.cost || b.valor || 0)
      );

      setFretes(lista);
    } catch (err) {
      console.error("Erro frete:", err);
    } finally {
      setLoadingFrete(false);
    }
  }
  // ===============================
  // FIM CALCULAR FRETE
  // ===============================


  // ===============================
  // CÁLCULO DE VALORES
  // ===============================
  const valorProduto = Number(produto?.preco || 0);

  const valorFrete = Number(
    freteSelecionado?.price ||
    freteSelecionado?.cost ||
    freteSelecionado?.valor ||
    0
  );

  const total = valorProduto + valorFrete;
  // ===============================
  // FIM CÁLCULO
  // ===============================


  // ===============================
  // ABRIR WHATSAPP
  // ===============================
  function falarWhatsapp() {
    const mensagem = encodeURIComponent(
      `Olá, tenho interesse no produto ${produto?.nome}`
    );

    window.open(
      `https://api.whatsapp.com/send?phone=5511984309480&text=${mensagem}`
    );
  }
  // ===============================
  // FIM WHATSAPP
  // ===============================


  // ===============================
  // FINALIZAR COMPRA (MERCADO PAGO)
  // ===============================
  async function comprar() {

    // Validação básica
    if (!cliente.nome || !cliente.telefone || !cliente.cep) {
      return alert("Preencha os dados obrigatórios");
    }

    if (!freteSelecionado) {
      return alert("Selecione um frete");
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cliente,
          nome: produto.nome,
          preco: produto.preco,
          frete: freteSelecionado,
          canto: cliente.canto || "",
        }),
      });

      const data = await res.json();

      // Redireciona para pagamento
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (err) {
      console.error("Erro compra:", err);
    }
  }
  // ===============================
  // FIM COMPRA
  // ===============================


  // ===============================
  // CONDIÇÕES DE RENDERIZAÇÃO
  // ===============================
  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado</p>;
  // ===============================
  // FIM CONDIÇÕES
  // ===============================


  // ===============================
  // RENDER PRINCIPAL (HTML)
  // ===============================
  return (
    <div style={container}>
      <div style={card}>
        
        {/* IMAGEM DO PRODUTO */}
        <div style={imgContainer}>
          <img src={produto.imagem} style={img} />
        </div>

        {/* DADOS DO PRODUTO */}
        <div style={{ flex: 1 }}>
          <h1>{produto.nome}</h1>

          {/* PREÇO */}
          <h2 style={{ color: "green" }}>
            {Number(produto.preco).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>

          <p>{produto.descricao}</p>

          {/* DESCRIÇÃO COMPLETA */}
          {produto.descricao_completa && (
            <div style={descricaoBox}>
              {produto.descricao_completa}
            </div>
          )}

          {/* ESTOQUE */}
          <p style={{ color: "red" }}>
            Restam apenas {produto.estoque} unidades
          </p>

          <hr />

          {/* FORMULÁRIO CLIENTE */}
          <input
            placeholder="Digite seu CEP"
            style={{ ...input, borderColor: cepErro ? "red" : "#ccc" }}
            onChange={(e) => handleChange("cep", e.target.value)}
          />

          {cepErro && (
            <p style={{ color: "red" }}>CEP inválido</p>
          )}

          <input placeholder="Seu nome" style={input} onChange={(e) => handleChange("nome", e.target.value)} />

          {/* BOTÕES */}
          <button style={btn} onClick={calcularFrete}>
            Calcular Frete
          </button>

          <button style={btn} onClick={comprar}>
            Compra segura
          </button>

          {/* FRETES */}
          {fretes.map((f, i) => {
            const valor = Number(f.price || f.cost || f.valor || 0);

            return (
              <div key={i}>
                <input
                  type="radio"
                  name="frete"
                  onChange={() => setFreteSelecionado(f)}
                />
                {f.name} - {valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            );
          })}

          {/* TOTAL */}
          <h3>
            Total: {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>

          {/* WHATSAPP */}
          <button style={whats} onClick={falarWhatsapp}>
            Falar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
// ===============================
// FIM DO COMPONENTE
// ===============================


// ===============================
// ESTILOS
// ===============================
const container = { padding: 20 };

const card = {
  display: "flex",
  gap: 30,
  maxWidth: 1000,
  margin: "0 auto",
  flexWrap: "wrap",
};

const imgContainer = {
  width: 350,
  height: 350,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const img = {
  width: "100%",
  maxWidth: 320,
  objectFit: "contain",
};

const input = {
  display: "block",
  width: "100%",
  marginBottom: 8,
  padding: 8,
};

const btn = {
  marginRight: 10,
  padding: 10,
};

const whats = {
  marginTop: 10,
  padding: 12,
  width: "100%",
  backgroundColor: "green",
  color: "white",
};

const descricaoBox = {
  marginTop: 15,
  padding: 15,
};