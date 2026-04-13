import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("/api/produto")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  return (
    <div style={{ background: "#f1f1f1", minHeight: "100vh" }}>

      {/* HEADER */}
      <header style={{
        background: "#000",
        color: "#FFD700",
        textAlign: "center",
        padding: "20px 10px"
      }}>
        <h2 style={{ margin: 0 }}>ENCARTEPROAVES TESTE 999</h2>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Tecnologia e Qualidade Para o Melhor Encarte de Canto
        </p>
      </header>

      {/* GRID DE PRODUTOS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px",
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>

        {produtos.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
              maxWidth: "320px",
              margin: "0 auto"
            }}
          >

            {/* IMAGEM */}
            <img
              src={p.imagem}
              alt={p.nome}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain",
                borderRadius: "8px",
                background: "#fff"
              }}
            />

            {/* NOME */}
            <h3 style={{
              fontSize: "16px",
              margin: "10px 0"
            }}>
              {p.nome}
            </h3>

            {/* PREÇO */}
            <p style={{
              color: "green",
              fontWeight: "bold",
              fontSize: "18px",
              margin: "5px 0"
            }}>
              R$ {Number(p.preco).toFixed(2)}
            </p>

            {/* DESCRIÇÃO */}
            <p style={{
              fontSize: "13px",
              color: "#444"
            }}>
              {p.descricao}
            </p>

            {/* ESTOQUE */}
            <p style={{
              fontSize: "12px",
              color: "red"
            }}>
              Restam apenas {p.estoque} unidades
            </p>

            {/* INPUT CEP */}
            <input
              placeholder="Digite seu CEP"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />

            {/* BOTÃO FRETE */}
            <button style={{
              width: "100%",
              marginTop: "8px",
              padding: "10px",
              background: "#ccc",
              border: "none",
              borderRadius: "5px"
            }}>
              Calcular Frete
            </button>

            {/* BOTÃO COMPRA */}
            <button style={{
              width: "100%",
              marginTop: "8px",
              padding: "10px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "5px"
            }}>
              Compra segura
            </button>

            {/* BOTÃO WHATSAPP */}
            <button style={{
              width: "100%",
              marginTop: "8px",
              padding: "10px",
              background: "#25D366",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold"
            }}>
              Falar no WhatsApp
            </button>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <footer style={{
        background: "#0b1a2c",
        color: "#fff",
        padding: "30px",
        marginTop: "40px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap"
        }}>

          <div>
            <h3>Encarteproaves</h3>
            <p>Tecnologia e Qualidade no Encarte de Canto de pássaros.</p>
          </div>

          <div>
            <h4>Links</h4>
            <p>
              <a href="/admin/produtos" style={{ color: "#fff" }}>
                Admin
              </a>
            </p>
          </div>

          <div>
            <h4>Contato</h4>
            <p>Falar no WhatsApp</p>
            <p>encarteproaves@gmail.com</p>
          </div>

        </div>

        <p style={{
          textAlign: "center",
          marginTop: "20px"
        }}>
          © 2026 Encarteproaves
        </p>
      </footer>

    </div>
  );
}