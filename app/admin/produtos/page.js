"use client";

import { useState } from "react";

export default function Produtos() {
  const [nome, setNome] = useState("");

  async function salvar() {
    await fetch("/api/produto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome })
    });

    alert("Produto salvo");
    setNome("");
  }

  return (
    <div>
      <h1>Produtos</h1>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do produto"
      />

      <button onClick={salvar}>Salvar</button>
    </div>
  );
}
