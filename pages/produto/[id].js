import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProdutoPage() {
  const router = useRouter();
  const { id } = router.query; // Captura o ID do produto vindo da URL (ex: /produto/123)

  // --- BLOCO DE ESTADOS (STATE) ---
  const [produto, setProduto] = useState(null); // Armazena os dados do produto vindos do banco
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento da página

  const [cliente, setCliente] = useState({}); // Armazena os dados do formulário (nome, cpf, cep, etc)
  const [fretes, setFretes] = useState([]); // Armazena a lista de transportadoras retornadas pela API
  const [freteSelecionado, setFreteSelecionado] = useState(null); // Armazena o frete específico que o usuário clicou
  const [loadingFrete, setLoadingFrete] = useState(false); // Feedback visual enquanto a API de frete responde
  const [cepErro, setCepErro] = useState(false); // Controla se o CEP digitado é válido ou não

  // --- BLOCO 1: BUSCA DE DADOS DO PRODUTO ---
  // Este useEffect roda assim que o ID está disponível na URL
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

  // --- BLOCO 2: BUSCA AUTOMÁTICA DE ENDEREÇO (ViaCEP) ---
  // Dispara sempre que o campo CEP no estado 'cliente' é alterado e atinge 8 dígitos
  useEffect(() => {
    if (!cliente.cep || cliente.cep.length < 8) return;

    async function buscarCep() {
      try {
        const cepLimpo = cliente.cep.replace(/\D/g, "");
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();

        if (data.erro) {
          setCepErro(true);
          return;
        }

        setCepErro(false);
        // Preenchimento automático dos campos de endereço para melhorar a conversão
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

  // Função auxiliar para atualizar o estado 'cliente' dinamicamente
  function handleChange(campo, valor) {
    setCliente((prev) => ({ ...prev, [campo]: valor }));
  }

  // --- BLOCO 3: CÁLCULO DE FRETE (API MELHOR ENVIO) ---
  // Implementa os Requisitos 1 e 2 (Mostrar Opções e Transportadoras)
  async function calcularFrete() {
    try {
      if (!cliente.cep) return alert("Digite o CEP");
      setLoadingFrete(true);

      const res = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: cliente.cep,
          produtoId: produto.id,
        }),
      });

      const data = await res.json();
      
      // TRATAMENTO: A API pode retornar 'options' ou o array direto
      let lista = data.options || data || [];

      // Filtra apenas opções que tenham custo (evita erros de transportadoras inativas)
      lista = lista.filter(
        (f) => Number(f.price || f.cost || f.valor || 0) > 0
      );

      // Ordenação por preço (mais barato primeiro)
      lista.sort((a, b) => 
        Number(a.price || a.cost || a.valor || 0) - Number(b.price || b.cost || b.valor || 0)
      );

      setFretes(lista); // Aqui a lista de transportadoras é injetada no sistema
    } catch (err) {
      console.error("Erro frete:", err);
    } finally {
      setLoadingFrete(false);
    }
  }

  // --- BLOCO 4: LÓGICA DE SOMA (Requisito 4) ---
  const valorProduto = Number(produto?.preco || 0);
  const valorFrete = Number(
    freteSelecionado?.price || freteSelecionado?.cost || freteSelecionado?.valor || 0
  );
  // Soma dinâmica: Total se atualiza automaticamente quando 'freteSelecionado' muda
  const total = valorProduto + valorFrete;

  // --- BLOCO 5: FINALIZAÇÃO (CHECKOUT E WHATSAPP) ---
  function falarWhatsapp() {
    const mensagem = encodeURIComponent(`Olá, tenho interesse no produto ${produto?.nome}`);
    window.open(`https://api.whatsapp.com/send?phone=5511984309480&text=${mensagem}`);
  }

  async function comprar() {
    if (!cliente.nome || !cliente.telefone || !cliente.cep) {
      return alert("Preencha os dados obrigatórios");
    }
    if (!freteSelecionado) {
      return alert("Selecione um frete"); // Garante que o Requisito 3 seja cumprido
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cliente,
          nome: produto.nome,
          preco: produto.preco,
          frete: freteSelecionado,
          canto: cliente.canto || "",
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point; // Redireciona para o Mercado Pago
      }
    } catch (err) {
      console.error("Erro compra:", err);
    }
  }

  // --- BLOCO 6: INTERFACE (JSX) ---
  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div style={container}>
      <div style={card}>
        <div style={imgContainer}>
          <img src={produto.imagem} style={img} />
        </div>

        <div style={{ flex: 1 }}>
          <h1>{produto.nome}</h1>
          <h2 style={{ color: "green" }}>
            {valorProduto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </h2>
          <p>{produto.descricao}</p>

          {/* FORMULÁRIO DE DADOS */}
          <input placeholder="Digite seu CEP" style={{ ...input, borderColor: cepErro ? "red" : "#ccc" }} onChange={(e) => handleChange("cep", e.target.value)} />
          <input placeholder="Seu nome" style={input} onChange={(e) => handleChange("nome", e.target.value)} />
          <input placeholder="Telefone" style={input} onChange={(e) => handleChange("telefone", e.target.value)} />
          <input placeholder="CPF" style={input} onChange={(e) => handleChange("cpf", e.target.value)} />
          
          {/* CAMPOS AUTO-PREENCHIDOS PELO VIACEP */}
          <input placeholder="Endereço" style={input} value={cliente.endereco || ""} onChange={(e) => handleChange("endereco", e.target.value)} />
          <input placeholder="Número" style={input} onChange={(e) => handleChange("numero", e.target.value)} />
          <input placeholder="Bairro" style={input} value={cliente.bairro || ""} onChange={(e) => handleChange("bairro", e.target.value)} />
          <input placeholder="Cidade" style={input} value={cliente.cidade || ""} onChange={(e) => handleChange("cidade", e.target.value)} />
          <input placeholder="Estado" style={input} value={cliente.estado || ""} onChange={(e) => handleChange("estado", e.target.value)} />

          <div style={{ marginTop: 10 }}>
            <button style={btn} onClick={calcularFrete}>Calcular Frete</button>
            <button style={btn} onClick={comprar}>Compra segura</button>
          </div>

          {loadingFrete && <p>Calculando frete...</p>}

          {/* --- IMPLEMENTAÇÃO DOS REQUISITOS 1, 2 e 3 --- */}
          {fretes.map((f, i) => {
            const valor = Number(f.price || f.cost || f.valor || 0);
            return (
              <div key={i} style={freteItem}>
                <input
                  type="radio"
                  name="frete"
                  onChange={() => setFreteSelecionado(f)} // Requisito 3: Opção para escolher
                />
                {/* Requisito 1 e 2: Mostrar Opção e Transportadora */}
                <span>{f.name} - {valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                <small> ({f.delivery_time || f.delivery_days || "?"} dias)</small>
              </div>
            );
          })}

          {/* REQUISITO 4: EXIBIÇÃO DO TOTAL SOMADO */}
          <h3 style={{ marginTop: 10 }}>
            Total: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </h3>

          <button style={whats} onClick={falarWhatsapp}>Falar no WhatsApp</button>
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS (Omitidos para brevidade, manter os originais) ---