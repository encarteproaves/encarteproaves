"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const [senha, setSenha] = useState("");
  const router = useRouter();

  function entrar() {
    if (senha === "123456") {
      localStorage.setItem("admin_logado", "true");
      router.push("/admin");
    } else {
      alert("Senha incorreta");
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login Admin</h1>

      <input
        type="password"
        placeholder="Digite a senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <button onClick={entrar}>Entrar</button>
    </div>
  );
}