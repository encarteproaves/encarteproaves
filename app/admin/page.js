"use client";

import { useEffect, useState } from "react";

export default function Admin(){

const [pedidos,setPedidos] = useState([]);

useEffect(()=>{
carregarPedidos();
},[]);

async function carregarPedidos(){

try{

const res = await fetch("/api/pedido");

const data = await res.json();

setPedidos(data);

}catch(err){

console.log("Erro ao carregar pedidos",err);

}

}

const hoje = new Date().toISOString().slice(0,10);

const pedidosHoje = pedidos.filter(p=>p?.data?.slice?.(0,10)===hoje);

const pagos = pedidos.filter(p=>p?.status==="Aguardando etiqueta");

const enviados = pedidos.filter(p=>p?.status==="Enviado");

const entregues = pedidos.filter(p=>p?.status==="Entregue");

const faturamento = pedidos
.filter(p=>p?.status!=="Aguardando pagamento")
.reduce((total,p)=>total+Number(p?.valor || 0),0);

return(

<div style={{padding:"40px",fontFamily:"Arial"}}>

<h1>Painel Administrativo</h1>

<hr/>

<h2>Resumo</h2>

<p>Pedidos hoje: {pedidosHoje.length}</p>

<p>Pagos: {pagos.length}</p>

<p>Enviados: {enviados.length}</p>

<p>Entregues: {entregues.length}</p>

<h2>Faturamento</h2>

<h1>R$ {faturamento}</h1>

<br/>

<a href="/pedidos">

Ver painel de pedidos

</a>

</div>

);

}
