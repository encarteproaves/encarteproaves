"use client";

import { useState } from "react";

export default function Login() {
  const [senha, setSenha] = useState("");

  function entrar() {
    if (senha === "123456") {
      document.cookie = "admin=true";
      window.location.href = "/admin";
    } else {
      alert("Senha incorreta");
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        type="password"
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={entrar}>Entrar</button>
    </div>
  );
}
