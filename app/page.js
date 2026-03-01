"use client";
import { useState } from "react";

export default function Home() {

 const products = [

  {
  id: 1,
  name: "Caixa Acústica Profissional para Encarte de Canto em pássaros",
  description: "Caixa acústica para encarte de canto em pássaros nas Medidas 65x65x35 cm • Alto rendimento • Ideal para aprendizado de canto",
  price: 1500,

  image: "/caixa-nova.png",

  weight: 22,
  width: 65,
  height: 65,
  length: 35,

  mpLink: "https://mpago.la/2foFNjY",
  whatsappLink: "https://wa.me/5511984309480",

  estoque: 1,
  badge: "Mais Vendido"
},
  {
  id: 2,
  name: "Aparelho Digital para Encarte de Canto",
  description: "Programador digital automático para treino de canto",
  price: 330,

  image: "/aparelho-novo.jpg",

  weight: 1,
  width: 15,
  height: 10,
  length: 20,

  mpLink: "https://mpago.la/1Po2ehy",
  whatsappLink: "https://wa.me/5511984309480",

  estoque: 10
},
 {
  id: 3,
  name: "Pen Drive 8GB Canto Editado",
  description: "Canto personalizado conforme pedido",
  price: 150,

  image: "/pendrive-8gb.jpg",

  weight: 0.2,
  width: 10,
  height: 10,
  length: 10,

  mpLink: "https://mpago.la/2s5hDUg",
  whatsappLink: "https://wa.me/5511984309480",

  estoque: 10
}

];
  const [cep, setCep] = useState({});
  const [frete, setFrete] = useState({});
  const [canto, setCanto] = useState({});
  const [loading, setLoading] = useState(false);

  async function calcularFrete(product){

  if (!cep?.[product.id] || cep[product.id].length < 8){
    alert("Digite um CEP válido");
    return;
  }

  setLoading(true);

  try{

    const res = await fetch("/api/frete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cep: cep[product.id],
        price: product.price,
        weight: product.weight,
        width: product.width,
        height: product.height,
        length: product.length
      })
    });

    const data = await res.json();

    /* garante array */
    const lista = Array.isArray(data) ? data : [];

    /* remove transportadoras inválidas */
    const filtrado = lista.filter(item=>{
      return item?.price && Number(item.price) > 0;
    });

    /* remove duplicadas */
    const unicas = Object.values(
      filtrado.reduce((acc,item)=>{
        acc[item.name] = item;
        return acc;
      },{})
    );

    /* ordena pelo frete mais barato */
    unicas.sort((a,b)=>{
      return Number(a.price) - Number(b.price);
    });

    setFrete(prev => ({
      ...prev,
      [product.id]: unicas
    }));

  }catch(err){
    console.log("Erro no frete:", err);
    alert("Erro ao calcular frete");
  }

  setLoading(false);
}
async function finalizarCompra(product){

  if(!frete?.[product.id]?.length){
    alert("Calcule o frete primeiro");
    return;
  }

  const envio = frete[product.id][0];

  await fetch("/api/pedido",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      produto: product.name,
      valor: product.price,
      cep: cep?.[product.id],
      frete: envio,
      canto: canto?.[product.id]
    })
  });

  window.open(product.mpLink,"_blank");
}
  return (

    <main style={{background:"#f5f5f5", fontFamily:"Arial"}}>

      <header style={{
        background:"#000",
        textAlign:"center",
        padding:"40px"
      }}>
        <img src="/logo.png" style={{width:"240px"}} />
        <h2 style={{color:"#f5d76e", marginTop:"10px"}}>
          TESTE HEADER 123
        </h2>
      </header>

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
            textAlign:"center",
            paddingBottom:"20px"
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

            <div style={{height:"280px"}}>
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

            <h2 style={{color:"#27ae60"}}>
              R$ {product.price}
            </h2>

            <p style={{color:"#e67e22"}}>
              Restam apenas {product.estoque} unidades
            </p>

            {product.id === 3 && (
              <input
                placeholder="Digite o nome do canto"
                value={canto?.[product.id] ?? ""}
                onChange={(e)=>{
                  setCanto(prev => ({
                    ...prev,
                    [product.id]: e.target.value
                  }));
                }}
                style={{
                  width:"80%",
                  padding:"10px",
                  marginTop:"10px",
                  borderRadius:"8px",
                  border:"1px solid #ddd"
                }}
              />
            )}

            <input
              placeholder="Digite seu CEP"
              value={cep?.[product.id] ?? ""}
              onChange={(e)=>{
                const valor = e.target.value.replace(/\D/g,"");
                setCep(prev => ({
                  ...prev,
                  [product.id]: valor
                }));
              }}
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
    display:"block",
    background:"#808080",
    color:"#fff",
    margin:"10px",
    padding:"12px",
    borderRadius:"8px",
    border:"none",
    cursor:"pointer",
    fontWeight:"bold"
  }}
>
  Calcular Frete
</button>
            >
              Calcular Frete
            </button>

            {loading && <p>Calculando...</p>}

            {Array.isArray(frete?.[product.id]) && frete[product.id].length > 0 && (
              <div style={{
                marginTop:"15px",
                background:"#fafafa",
                padding:"10px",
                borderRadius:"10px"
              }}>
                {frete[product.id].map((item, index)=>(
                  <div key={index} style={{
                    borderBottom:"1px solid #eee",
                    padding:"8px",
                    fontSize:"14px"
                  }}>
                    <b>{item.name}</b><br/>
                    💰 R$ {item.price}<br/>
                    ⏱ {item.delivery_time} dias
                  </div>
                ))}
              </div>
            )}
{/* BOTÃO COMPRA */}
<button
  onClick={()=>window.open(product.mpLink,"_blank")}
  style={{
    display:"block",
    background:"#000",
    color:"#fff",
    margin:"15px",
    padding:"12px",
    borderRadius:"8px",
    border:"none",
    fontWeight:"bold",
    cursor:"pointer"
  }}
>
  Compra Segura
</button>

{/* BOTÃO WHATSAPP */}
<a
  href={product.whatsappLink}
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
  Falar no WhatsApp
</a>
          </div>
        ))}
      </section>
    </main>
  );
}
