"use client";

import {useEffect,useState} from "react";

export default function Admin(){

const [pedidos,setPedidos] = useState([]);

useEffect(()=>{
carregarPedidos();
},[]);

async function carregarPedidos(){

const res = await fetch("/api/pedido");

const data = await res.json();

setPedidos(data);

}

const hoje = new Date().toISOString().slice(0,10);

const pedidosHoje = pedidos.filter(p=>p?.data?.slice(0,10)===hoje);

const pagos = pedidos.filter(p=>p?.status==="Aguardando etiqueta");

const enviados = pedidos.filter(p=>p?.status==="Enviado");

const entregues = pedidos.filter(p=>p?.status==="Entregue");

const faturamento = pedidos
.filter(p=>p?.status!=="Aguardando pagamento")
.reduce((total,p)=>total + Number(p?.valor || 0),0);

return(

<div style={{padding:"40px"}}>

<h1>Dashboard Administrativo</h1>

<h3>Pedidos hoje: {pedidosHoje.length}</h3>
<h3>Pagos: {pagos.length}</h3>
<h3>Enviados: {enviados.length}</h3>
<h3>Entregues: {entregues.length}</h3>

<h2>Faturamento</h2>

<h1>R$ {faturamento}</h1>

<a href="/pedidos">Ver pedidos</a>

</div>

);

}
