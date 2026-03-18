async function atualizarStatus(id,status){

  await fetch("/api/pedido",{
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      id,
      status
    })
  });

  carregarPedidos()

}
"use client";
import { useEffect, useState } from "react";

export default function Pedidos(){

  const [pedidos,setPedidos] = useState([]);

 async function carregarPedidos(){
  try{
    const res = await fetch("/api/pedido");
    const data = await res.json();
    setPedidos(data);
  }catch(err){
    console.log("Erro ao carregar pedidos",err);
  }
}
  useEffect(()=>{
    carregarPedidos();
  },[]);

  /* GERAR ETIQUETA */

  async function gerarEtiqueta(pedido){
  try{
    const res = await fetch("/api/etiqueta",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        cep: pedido.cep,
        service: pedido.frete?.id,
        width: pedido.frete?.packages?.[0]?.dimensions?.width || 65,
        height: pedido.frete?.packages?.[0]?.dimensions?.height || 65,
        length: pedido.frete?.packages?.[0]?.dimensions?.length || 35,
        weight: pedido.frete?.packages?.[0]?.weight || 8,
        valor: pedido.valor
      })
    });
    const data = await res.json();
    if(data.sucesso){
      window.open("https://melhorenvio.com.br/app/envios","_blank");
      carregarPedidos();
    }else{
      alert("Erro ao gerar etiqueta");
    }
  }catch(err){
    console.log("Erro etiqueta:",err);
    alert("Erro ao comunicar com servidor");
  }
}
  return(

    <div style={{padding:"40px"}}>

      <h1>Painel de Pedidos</h1>

      {pedidos.map(p=>(

        <div key={p.id} style={{
          border:"1px solid #ddd",
          padding:"15px",
          marginBottom:"15px",
          borderRadius:"10px"
        }}>

          <strong>{p.produto}</strong><br/>
          CEP: {p.cep}<br/>
          Valor: R$ {p.valor}<br/>
          Frete: {p.frete?.name}<br/>
          Status: {p.status}<br/>

          {p.status === "Aguardando etiqueta" && (

            <button
              type="button"
              onClick={()=>gerarEtiqueta(p)}
              style={{
                marginTop:"10px",
                background:"#f39c12",
                color:"#fff",
                padding:"8px",
                borderRadius:"6px",
                border:"none",
                cursor:"pointer"
              }}
            >
              Gerar etiqueta
            </button>

          )}

          {p.status === "Etiqueta gerada" && (
<button
onClick={()=>atualizarStatus(p.id,"Enviado")}
style={{
marginTop:"10px",
background:"#3498db",
color:"#fff",
padding:"8px",
borderRadius:"6px",
border:"none",
cursor:"pointer"
}}
>
Marcar como enviado
</button>

)}
  {p.status === "Enviado" && (

<button
onClick={()=>atualizarStatus(p.id,"Entregue")}
style={{
marginTop:"10px",
background:"#2ecc71",
color:"#fff",
padding:"8px",
borderRadius:"6px",
border:"none",
cursor:"pointer"
}}
>
Marcar como entregue
</button>

)}
            <a
              href="https://melhorenvio.com.br/app/envios"
              target="_blank"
              style={{
                display:"inline-block",
                marginTop:"10px",
                background:"#27ae60",
                color:"#fff",
                padding:"8px",
                borderRadius:"6px",
                textDecoration:"none"
              }}
            >
              Abrir no Melhor Envio
            </a>

        </div>

      ))}

    </div>

  );

}
