"use client";
import { useEffect, useState } from "react";

export default function Pedidos(){

  const [pedidos,setPedidos] = useState([]);

  async function carregarPedidos(){
    const res = await fetch("/api/pedido");
    const data = await res.json();
    setPedidos(data);
  }

  useEffect(()=>{
    carregarPedidos();
  },[]);

  /* 🔥 GERAR ETIQUETA */
 async function gerarEtiqueta(pedido){

  const res = await fetch("/api/etiqueta",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      cep: pedido.cep,
      service: pedido.frete?.id
    })
  })

  const data = await res.json()

  if(data.etiqueta){

  window.open(data.etiqueta.url,"_blank")

}else{

  alert("Erro ao gerar etiqueta")

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

          {/* 🟡 GERAR */}
          {p.status === "Aguardando etiqueta" && (
            <button
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
  <a
    href="https://melhorenvio.com.br/app/shipment"
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
)}
        </div>

      ))}

    </div>
  );
}
