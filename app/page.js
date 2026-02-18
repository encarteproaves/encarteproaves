"use client";
import { useState } from "react";

export default function Home() {
  const [frete, setFrete] = useState({});
  const [cep, setCep] = useState("");
  const [cantoPersonalizado, setCantoPersonalizado] = useState("");

  const whatsappNumber = "5511984309480"; // COLOQUE SEU NÚMERO

  const products = [
    {
      name: "Caixa Acústica para encarte de canto",
      price: 1500,
      mpLink: "https://mpago.la/2foFNjY",
      image: "/caixa-nova.png",
      description:
        "Caixa acústica profissional para encarte. Forte, resistente e com excelente propagação sonora."
    },
    {
      name: "Aparelho Digital para encarte de canto",
      price: 330,
      mpLink: "https://mpago.la/1Po2ehy",
      image: "/aparelho-novo.jpg",
      description:
        "Aparelho digital com programações automáticas para manter o treino do canto com regularidade."
    },
    {
      name: "Pen Drive 8GB Personalizado",
      price: 150,
      mpLink: "#",
      image: "/pendrive-8gb.jpg",
      description:
        "Pen drive com canto editado conforme seu pedido. Pronto para usar no treino."
    }
  ];

  const calcularFrete = (productName) => {
    if (!cep) {
      alert("Digite o CEP!");
      return;
    }

    setFrete({ ...frete, [productName]: 20 });
  };

  const gerarLinkWhatsApp = (productName) => {
    let mensagem = `Olá, tenho interesse no produto: ${productName}`;

    if (productName === "Pen Drive 8GB Personalizado" && cantoPersonalizado) {
      mensagem += ` - Canto desejado: ${cantoPersonalizado}`;
    }

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", background: "#f4f6f8" }}>

      {/* HEADER */}
      <header style={{ background: "#0d3b26", padding: "25px 15px", color: "#fff", textAlign: "center" }}>
        <h1>Encarte Pro Aves</h1>
        <p>Qualidade profissional com preço justo</p>
      </header>

      {/* BLOCO AUTORIDADE */}
      <section style={{ padding: "25px 15px", textAlign: "center", background: "#fff" }}>
        <h2>Especialistas em Encarte Profissional</h2>
        <p>
          Trabalhamos com equipamentos testados e aprovados por criadores.
          Atendimento direto pelo WhatsApp e envio rápido para todo o Brasil.
        </p>
      </section>

      {/* BLOCO CONFIANÇA */}
      <section style={{ padding: "20px 15px", background: "#e9f5ef", textAlign: "center" }}>
        <h3>Compra 100% Segura</h3>
        <p>Pagamento protegido via Mercado Pago.</p>
        <p>Atendimento rápido e suporte direto.</p>
        <p>Direito garantido pelo Código de Defesa do Consumidor.</p>
      </section>

      {/* BLOCO ENVIO */}
      <section style={{ padding: "20px 15px", background: "#fff", textAlign: "center" }}>
        <h3>Envio Rápido</h3>
        <p>Aparelho e Pen Drive: envio imediato.</p>
        <p>Caixa: envio imediato se em estoque ou até 5 dias úteis.</p>
      </section>

      {/* PRODUTOS */}
      <section style={{ padding: "30px 15px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "25px" }}>
        {products.map((product, i) => (
          <div key={i} style={{
            background: "#fff",
            width: "100%",
            maxWidth: "340px",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            paddingBottom: "20px",
            textAlign: "center"
          }}>

            <img src={product.image} style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "12px 12px 0 0" }} />

            <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
            <p style={{ padding: "0 15px", fontSize: "14px" }}>{product.description}</p>
            <h2 style={{ color: "#0d3b26" }}>R$ {product.price.toFixed(2)}</h2>

            {product.name === "Pen Drive 8GB Personalizado" && (
              <input
                type="text"
                placeholder="Digite o canto desejado"
                value={cantoPersonalizado}
                onChange={(e) => setCantoPersonalizado(e.target.value)}
                style={{ width: "85%", padding: "8px", marginBottom: "10px" }}
              />
            )}

            <div style={{ display: "flex", gap: "8px", padding: "0 15px" }}>
              <a href={product.mpLink} target="_blank"
                style={{ flex: 1, background: "#ffc107", padding: "10px", borderRadius: "6px", textDecoration: "none", color: "#000" }}>
                Comprar
              </a>

              <a href={gerarLinkWhatsApp(product.name)} target="_blank"
                style={{ flex: 1, background: "#25D366", padding: "10px", borderRadius: "6px", textDecoration: "none", color: "#fff" }}>
                WhatsApp
              </a>
            </div>

          </div>
        ))}
      </section>

      {/* RODAPÉ PROFISSIONAL */}
      <footer style={{ background: "#0d3b26", color: "#fff", textAlign: "center", padding: "20px" }}>
        <p>© 2026 Encarte Pro Aves</p>
        <p>Atendimento via WhatsApp</p>
        <p>Envio para todo o Brasil</p>
      </footer>

      {/* BOTÃO FLUTUANTE */}
      <a href={`https://wa.me/${whatsappNumber}`} target="_blank"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25D366",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "28px",
          textDecoration: "none",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
        }}>
        💬
      </a>

    </div>
  );
}
