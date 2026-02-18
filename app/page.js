"use client";
import { useState } from "react";

export default function Home() {
  const [frete, setFrete] = useState({});
  const [cep, setCep] = useState("");
  const [cantoPersonalizado, setCantoPersonalizado] = useState("");

  const whatsappNumber = "5511984309480"; // 🔥 COLOQUE SEU NÚMERO AQUI

  const products = [
    {
      name: "Caixa Acústica",
      price: 1500,
      mpLink: "https://mpago.la/2foFNjY",
      image: "/caixa-nova.png",
      description:
        "Caixa acústica 65x65x35 cm, MDF 15mm, vidro temperado 8mm e alto falante de alto rendimento."
    },
    {
      name: "Aparelho Digital para encarte de canto",
      price: 330,
      mpLink: "https://mpago.la/1Po2ehy",
      image: "/aparelho-novo.jpg",
      description:
        "Aparelho digital para encarte de canto em pássaros com 8 programações, USB, cartão de memória e rádio AM/FM."
    },
    {
      name: "Pen Drive 8GB Personalizado",
      price: 150,
      mpLink: "#",
      image: "/pendrive-8gb.jpg",
      description:
        "Pen drive 8GB com canto editado e gravado conforme pedido do comprador."
    }
  ];

  const calcularFrete = (productName) => {
    if (!cep) {
      alert("Digite o CEP!");
      return;
    }

    const valorFrete = 20;
    setFrete({ ...frete, [productName]: valorFrete });
  };

  const gerarLinkWhatsApp = (productName) => {
    let mensagem = `Olá, tenho interesse no produto: ${productName}`;

    if (productName === "Pen Drive 8GB Personalizado" && cantoPersonalizado) {
      mensagem += `\nCanto desejado: ${cantoPersonalizado}`;
    }

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", background: "#f4f6f8" }}>
      
      {/* HEADER */}
      <header
        style={{
          background: "#000",
          padding: "30px 15px",
          color: "#f5d76e",
          textAlign: "center"
        }}
      >
        <img src="/logo.png" style={{ width: "180px", maxWidth: "90%" }} />
        <h1 style={{ fontSize: "22px" }}>Encarte Pro Aves</h1>
        <p style={{ fontSize: "14px" }}>
          Tecnologia e Qualidade para o Melhor Encarte
        </p>
      </header>

      {/* PRODUTOS */}
      <section
        style={{
          padding: "30px 15px",
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap"
        }}
      >
        {products.map((product, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "350px",
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              overflow: "hidden",
              textAlign: "center",
              paddingBottom: "20px"
            }}
          >
            {/* IMAGEM */}
            <div
              style={{
                width: "100%",
                height: "250px",
                backgroundColor:
                  product.name === "Aparelho Digital"
                    ? "#ffffff"
                    : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img
                src={product.image}
                style={{
                  width:
                    product.name === "Aparelho Digital"
                      ? "auto"
                      : "100%",
                  height:
                    product.name === "Aparelho Digital"
                      ? "85%"
                      : "100%",
                  objectFit:
                    product.name === "Aparelho Digital"
                      ? "contain"
                      : "cover"
                }}
              />
            </div>

            <h2 style={{ fontSize: "18px", margin: "10px 0" }}>
              {product.name}
            </h2>

            <p style={{ fontSize: "13px", color: "#555", padding: "0 15px" }}>
              {product.description}
            </p>

            <h3 style={{ color: "#0d3b26", margin: "10px 0" }}>
              R$ {product.price.toFixed(2)}
            </h3>

            {/* CAMPO PERSONALIZAÇÃO PEN DRIVE */}
            {product.name === "Pen Drive 8GB Personalizado" && (
              <div style={{ padding: "0 15px", marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="Digite o canto desejado"
                  value={cantoPersonalizado}
                  onChange={(e) => setCantoPersonalizado(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc"
                  }}
                />
              </div>
            )}

            {/* FRETE */}
            <div style={{ padding: "0 15px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                style={{
                  padding: "6px",
                  width: "60%",
                  borderRadius: "5px",
                  border: "1px solid #ccc"
                }}
              />
              <button
                onClick={() => calcularFrete(product.name)}
                style={{
                  padding: "6px 10px",
                  marginLeft: "5px",
                  background: "#0d3b26",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px"
                }}
              >
                OK
              </button>

              {frete[product.name] && (
                <p style={{ marginTop: "5px", fontWeight: "bold" }}>
                  Frete: R$ {frete[product.name].toFixed(2)}
                </p>
              )}
            </div>

            {/* BOTÕES */}
            <div style={{ display: "flex", gap: "8px", padding: "0 15px", flexWrap: "wrap" }}>
              
              <a
                href={product.mpLink}
                target="_blank"
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#ffc107",
                  color: "#000",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "13px"
                }}
              >
                Mercado Pago
              </a>

              <a
                href={gerarLinkWhatsApp(product.name)}
                target="_blank"
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#25D366",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "13px"
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
