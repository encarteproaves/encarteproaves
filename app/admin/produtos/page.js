"use client";

import { useState, useEffect } from "react";

export default function Produtos() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [lista, setLista] = useState([]);

  async function carregar() {
    const res = await fetch("/api/produto");
    const dados = await res.json();
    setLista(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();

    await fetch("/api/produto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        preco,
        descricao,
      }),
    });

    setNome("");
    setPreco("");
    setDescricao("");

    carregar();
  }

  async function excluir(id) {
    await fetch("/api/produto", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    carregar();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cadastro de Produtos</h1>

      <form onSubmit={salvar} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <button type="submit">Salvar</button>
      </form>

      <h2>Lista de Produtos</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {lista.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{p.nome}</h3>

            <p style={{ fontWeight: "bold", color: "green" }}>
              {Number(p.preco).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

            <p style={{ color: "#555", fontSize: "14px" }}>
              {p.descricao}
            </p>

            <button
              onClick={() => excluir(p.id)}
              style={{
                marginTop: "10px",
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}