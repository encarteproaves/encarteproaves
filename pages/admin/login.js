import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [senha, setSenha] = useState("");

  function entrar(e) {
    e.preventDefault();

    if (senha === "123456") {
      localStorage.setItem("admin_logado", "true");
      router.push("/admin/produtos");
    } else {
      alert("Senha incorreta");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login Admin</h1>

      <form onSubmit={entrar} autoComplete="off">
        <input
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="new-password"
        />

        <br /><br />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}