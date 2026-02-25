"use client";
import { useEffect, useState } from "react";

export default function Pedidos(){

  const [pedidos,setPedidos] = useState([]);

  useEffect(()=>{
    fetch("/api/pedido")
    .then(r=>r.json())
    .then(setPedidos);
  },[]);

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

          <button
            style={{
              marginTop:"10px",
              background:"#000",
              color:"#fff",
              padding:"8px",
              borderRadius:"6px"
            }}
          >
            Imprimir etiqueta
          </button>

        </div>
      ))}

    </div>
  );
}
