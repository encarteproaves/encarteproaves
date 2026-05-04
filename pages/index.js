// ===============================
// IMPORTAÇÕES
// ===============================

// Hook de estado e efeito do React
import { useEffect, useState } from "react";

// Link do Next.js para navegação entre páginas
import Link from "next/link";


// ===============================
// COMPONENTE PRINCIPAL (HOME)
// ===============================
export default function Home() {

  // ===============================
  // ESTADOS
  // ===============================

  const [produtos, setProdutos] = useState([]); // Lista de produtos
  const [fretes, setFretes] = useState({}); // Fretes por produto (objeto por ID)
  const [loadingFrete, setLoadingFrete] = useState({}); // Loading por produto
  const [cliente, setCliente] = useState({}); // Dados do cliente por produto


  // ===============================
  // CARREGAR PRODUTOS AO INICIAR
  // ===============================
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetch("/api/produtos");
        const data = await res.json();
        setProdutos(data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    }

    carregarProdutos();
  }, []);
  // ===============================
  // FIM CARREGAMENTO PRODUTOS
  // ===============================


  // ===============================
  // ATUALIZA DADOS DO CLIENTE POR PRODUTO
  // ===============================
  function handleClienteChange(id, campo, valor) {
    setCliente((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  }
  // ===============================
  // FIM HANDLE CLIENTE
  // ===============================


  // ===============================
  // CALCULAR FRETE POR PRODUTO
  // ===============================
  async function calcularFrete(p) {
    try {
      // Ativa loading apenas para esse produto
      setLoadingFrete((prev) => ({ ...prev, [p.id]: true }));

      const res = await fetch("/api/frete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ produto: p }),
      });

      const data = await res.json();

      // Salva fretes por ID do produto
      setFretes((prev) => ({
        ...prev,
        [p.id]: data,
      }));

    } catch (err) {
      console.error("Erro frete:", err);
    } finally {
      // Desativa loading do produto específico
      setLoadingFrete((prev) => ({ ...prev, [p.id]: false }));
    }
  }
  // ===============================
  // FIM CALCULAR FRETE
  // ===============================


  // ===============================
  // SELECIONAR FRETE
  // ===============================
  function selecionarFrete(id, frete) {
    console.log("Frete selecionado:", id, frete);
  }
  // ===============================
  // FIM SELEÇÃO FRETE
  // ===============================


  // ===============================
  // AÇÃO DE COMPRA (AINDA SIMPLES)
  // ===============================
  function compraSegura(p) {
    console.log("Compra:", p);
  }
  // ===============================
  // FIM COMPRA
  // ===============================


  // ===============================
  // ABRIR WHATSAPP
  // ===============================
  function falarWhatsapp(p) {
    const mensagem = encodeURIComponent(
      `Olá, tenho interesse no produto ${p?.nome || ""}`
    );

    window.open(`https://wa.me/5511984309480?text=${mensagem}`);
  }
  // ===============================
  // FIM WHATSAPP
  // ===============================


  // ===============================
  // FORMATAR MOEDA
  // ===============================
  function formatarMoeda(v) {
    return Number(v || 0).toFixed(2);
  }
  // ===============================
  // FIM FORMATAÇÃO
  // ===============================


  // ===============================
  // RENDER PRINCIPAL
  // ===============================
  return (
    <main style={{ padding: 20 }}>

      {/* TÍTULO */}
      <h1 style={{ textAlign: "center" }}>
        ENCARTEPROAVES
      </h1>

      {/* LISTA DE PRODUTOS */}
      <div style={{
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        justifyContent: "center"
      }}>

        {produtos.map((p) => (

          // ===============================
          // CARD DO PRODUTO
          // ===============================
          <div
  key={p.id}
  style={{
    width: 250,
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  }}
>
  {/* IMAGEM */}
  <img
    src={p.imagem || "/placeholder.png"}
    alt={p.nome}
    style={{
      width: "100%",
      maxHeight: "200px",
      objectFit: "contain",
      marginBottom: "10px",
    }}
  />

  {/* NOME */}
  <h3>{p.nome}</h3>

  {/* PREÇO */}
  <p style={{ color: "green", fontWeight: "bold" }}>
    R$ {formatarMoeda(p.preco)}
  </p>

  {/* BOTÕES */}
  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    
    <Link
      href={`/produto/${p.id}`}
      style={{
        flex: 1,
        textAlign: "center",
        padding: "10px",
        background: "#0070f3",
        color: "#fff",
        borderRadius: "6px",
      }}
    >
      Ver detalhes
    </Link>

    <button
      onClick={() => falarWhatsapp(p)}
      style={{
        flex: 1,
        background: "#25D366",
        color: "#fff",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      WhatsApp
    </button>

  </div>
</div>
            ))}


            {/* LINK PARA DETALHES */}
            {p?.id && (
              <Link
                href={`/produto/${p.id}`}
                style={{
                  display: "block",
                  marginTop: "5px",
                  width: "100%",
                  textAlign: "center",
                  padding: "10px",
                  background: "#ddd",
                  borderRadius: "4px",
                }}
              >
                Ver detalhes
              </Link>
            )}


            {/* BOTÃO COMPRA */}
            <button onClick={() => compraSegura(p)}>
              Compra segura
            </button>


            {/* BOTÃO WHATSAPP */}
            <button
              onClick={() => falarWhatsapp(p)}
              style={{
                background: "#25D366",
                color: "#fff",
                width: "100%",
                marginTop: "5px",
              }}
            >
              Falar no WhatsApp
            </button>

          </div>
          // ===============================
          // FIM CARD PRODUTO
          // ===============================

        ))}

      </div>
      {/* ===============================
          FIM LISTA PRODUTOS
         =============================== */}

    </main>
  );
}
// ===============================
// FIM COMPONENTE HOME
// ===============================