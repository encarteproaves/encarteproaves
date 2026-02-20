"use client";
import { useState } from "react";
export default function Home() {
  const [cart,setCart] = useState([]);
const [cep, setCep] = useState("");
const [frete, setFrete] = useState(null);
const calcularFrete = async () => {
  if (cep.length < 8) {
    alert("Digite um CEP válido");
    return;
  }

  const response = await fetch("/api/frete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cep,
      width: 30,
      height: 30,
      length: 30,
      weight: 1,
      price: 100
    })
  });

  const data = await response.json();

  if (data && data[0]) {
    setFrete(data[0].price);
  }
};

    {
      id: 1,
      name: "Caixa Acústica Profissional",
      description: "Caixa acústica profissional para encarte de canto - Medidas 65x65x35 cm",
      price: 1500,
      image: "/caixa-nova.png",
      weight: 8,
      width: 65,
      height: 65,
      length: 35,
      mpLink: "https://mpago.la/2foFNjY",
      estoque: 7,
      badge: "Mais Vendido"
    },

    {
      id: 2,
      name: "Aparelho Digital para Encarte",
      description: "Aparelho digital programável para treino de canto automático",
      price: 330,
      image: "/aparelho-novo.jpg",
      weight: 1,
      width: 20,
      height: 20,
      length: 20,
      mpLink: "https://mpago.la/1Po2ehy",
      estoque: 12
    },

    {
      id: 3,
      name: "Pen Drive 8GB Canto Editado",
      description: "Pen drive com canto personalizado conforme pedido",
      price: 150,
      image: "/pendrive-8gb.jpg",
      weight: 0.2,
      width: 10,
      height: 10,
      length: 10,
      mpLink: "https://wa.me/5511984309480",
      estoque: 20
    }

  ];

  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState(null);
  const [loading, setLoading] = useState(false);

  async function calcularFrete(product){

    setLoading(true);

    const res = await fetch("/api/frete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cep,
        price: product.price,
        weight: product.weight,
        width: product.width,
        height: product.height,
        length: product.length
      })
    });

    const data = await res.json();

    setFrete(data);
    setLoading(false);
  }

  return (

    <main style={{background:"#f5f5f5", fontFamily:"Arial"}}>

      {/* HEADER */}
      <header style={{
        background:"#000",
        textAlign:"center",
        padding:"40px"
      }}>

        <img src="/logo.png" style={{width:"240px"}} />

        <h2 style={{
          color:"#f5d76e",
          marginTop:"10px",
          letterSpacing:"1px"
        }}>
          Tecnologia e Qualidade para o Melhor Encarte de Canto
        </h2>

      </header>

      {/* PRODUTOS */}
      <section style={{
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"center",
        gap:"40px",
        padding:"50px"
      }}>

        {products.map(product => (

          <div key={product.id} style={{
            width:"320px",
            background:"#fff",
            borderRadius:"15px",
            boxShadow:"0 10px 25px rgba(0,0,0,.08)",
            overflow:"hidden",
            textAlign:"center"
          }}>

            {product.badge && (
              <div style={{
                background:"#ff0000",
                color:"#fff",
                padding:"6px",
                fontWeight:"bold"
              }}>
                {product.badge}
              </div>
            )}

            {/* IMAGEM */}
            <div style={{height:"300px"}}>
              <img src={product.image} style={{
                width:"100%",
                height:"100%",
                objectFit:"contain"
              }} />
            </div>

            <h3>{product.name}</h3>

            <p style={{padding:"0 15px"}}>
              {product.description}
            </p>

            <h2>R$ {product.price}</h2>

            {/* ESTOQUE */}
            <p style={{color:"#e67e22"}}>
              Restam apenas {product.estoque} unidades
            </p>

            {/* GARANTIA */}
            <p style={{fontSize:"13px", color:"#777"}}>
              Garantia de 7 dias
            </p>

            {/* CEP */}
            <input
              placeholder="Digite seu CEP"
              value={cep}
              onChange={(e)=>setCep(e.target.value)}
              style={{
                width:"80%",
                padding:"10px",
                marginTop:"10px",
                borderRadius:"8px",
                border:"1px solid #ddd"
              }}
            />

            <button
              onClick={()=>calcularFrete(product)}
              style={{
                background:"#000",
                color:"#fff",
                border:"none",
                padding:"10px",
                borderRadius:"8px",
                marginTop:"10px",
                cursor:"pointer"
              }}
            >
              Calcular Frete
            </button>

            {loading && <p>Calculando...</p>}

            {frete && (
              <p style={{color:"green"}}>
                Frete disponível
              </p>
            )}

            {/* BOTÃO COMPRA */}
            <a
              href={product.mpLink}
              target="_blank"
              style={{
                display:"block",
                background:"#000",
                color:"#fff",
                margin:"15px",
                padding:"12px",
                borderRadius:"8px",
                textDecoration:"none",
                fontWeight:"bold"
              }}
            >
              Compra Segura
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/5511984309480"
              target="_blank"
              style={{
                display:"block",
                background:"#25D366",
                color:"#fff",
                margin:"0 15px 20px",
                padding:"12px",
                borderRadius:"8px",
                textDecoration:"none",
                fontWeight:"bold"
              }}
            >
              Atendimento WhatsApp
            </a>

          </div>

        ))}

      </section>

    </main>
  );
}
