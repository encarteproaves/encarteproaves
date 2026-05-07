import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchProdutos() {
      const res = await fetch("/api/produtos");
      const data = await res.json();
      setProdutos(data);
    }

    fetchProdutos();
  }, []);

  return (
    <div style={container}>
      
      {/* HEADER */}
      <header style={header}>
        <div style={headerContent}>
          <img src="/logo.png" alt="Logo" style={logo} />
          <div>
            <h1 style={titulo}>ENCARTEPROAVES</h1>
            <p style={subtitulo}>
              Tecnologia e Qualidade Para o Melhor Encarte de Canto
            </p>
          </div>
        </div>
      </header>

      {/* PRODUTOS */}
      <main style={grid}>
        {produtos.map((p) => (
          <div key={p.id} style={card}>
            
            <img src={p.imagem} alt={p.nome} style={img} />

            <h3 style={nome}>{p.nome}</h3>

            <p style={preco}>
              {Number(p.preco || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

            <p style={estoque}>
              Restam apenas {p.estoque} unidades
            </p>

            <Link href={`/produto/${p.id}`}>
              <button style={btnDetalhes}>Ver detalhes</button>
            </Link>

            <a
              href={`https://api.whatsapp.com/send?phone=5511981309480&text=Olá, tenho interesse no produto ${p.nome}`}
              target="_blank"
            >
              <button style={btnWhats}>Falar no WhatsApp</button>
            </a>
          </div>
        ))}
      </main>

      {/* FOOTER ANTIGO (RESTAURADO) */}
      <footer style={footer}>
        <div style={footerContainer}>
          
          <div>
            <h3 style={footerTitle}>ENCARTEPROAVES</h3>
            <p>Tecnologia e qualidade para o melhor encarte de canto.</p>
          </div>

          <div>
            <h3 style={footerTitle}>Contato</h3>
            <p>WhatsApp: (11) 98430-9480</p>
          </div>

          <div>
            <h3 style={footerTitle}>Atendimento</h3>
            <p>Segunda a Sábado</p>
            <p>08h às 18h</p>
          </div>

        </div>

        <hr style={linha} />

        <p style={copy}>© 2026 ENCARTEPROAVES</p>
      </footer>

    </div>
  );
}

///////////////////////
// 🎨 ESTILOS
///////////////////////

const container = {
  fontFamily: "Arial, sans-serif",
  background: "#f5f5f5",
};

const header = {
  backgroundColor: "#000",
  padding: "20px 10px",
};

const headerContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,
  flexWrap: "wrap",
};

const logo = {
  width: 140,
  height: "auto",
};

const titulo = {
  color: "#FFD700",
  margin: 0,
  fontSize: 28,
};

const subtitulo = {
  color: "#FFD700",
  margin: 0,
  fontSize: 14,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 20,
  padding: 20,
  maxWidth: 1200,
  margin: "0 auto",
};

const card = {
  background: "#fff",
  borderRadius: 10,
  padding: 15,
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const img = {
  width: "100%",
  height: 180,
  objectFit: "contain",
  marginBottom: 10,
};

const nome = {
  fontSize: 16,
  marginBottom: 10,
};

const preco = {
  color: "green",
  fontWeight: "bold",
  marginBottom: 5,
};

const estoque = {
  color: "red",
  fontSize: 12,
  marginBottom: 10,
};

const btnDetalhes = {
  width: "100%",
  padding: 10,
  marginBottom: 8,
  background: "#ddd",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const btnWhats = {
  width: "100%",
  padding: 10,
  background: "#25D366",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

///////////////////////
// 🔥 FOOTER ANTIGO
///////////////////////

const footer = {
  background: "#000",
  color: "#FFD700",
  padding: "30px 20px 10px",
  marginTop: 40,
};

const footerContainer = {
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
  textAlign: "center",
  gap: 20,
};

const footerTitle = {
  marginBottom: 10,
};

const linha = {
  borderColor: "#333",
  margin: "20px 0",
};

const copy = {
  textAlign: "center",
  fontSize: 12,
};