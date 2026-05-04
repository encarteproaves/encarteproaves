// ===============================
// IMPORTAÇÕES
// ===============================

// Hook de estado do React
import { useState } from "react";

// Roteador do Next.js (para navegação)
import { useRouter } from "next/router";


// ===============================
// COMPONENTE DE LOGIN ADMIN
// ===============================
export default function Login() {

  // ===============================
  // CONTROLE DE ROTA
  // ===============================
  const router = useRouter();


  // ===============================
  // ESTADO DA SENHA
  // ===============================
  const [senha, setSenha] = useState("");
  // ===============================
  // FIM ESTADO
  // ===============================


  // ===============================
  // FUNÇÃO DE LOGIN
  // ===============================
  function entrar(e) {

    // Evita recarregar a página ao enviar formulário
    e.preventDefault();


    // ===============================
    // VALIDAÇÃO DA SENHA
    // ===============================
    if (senha === "123456") {

      // Salva no navegador que o admin está logado
      localStorage.setItem("admin_logado", "true");

      // Redireciona para painel de produtos
      router.push("/admin/produtos");

    } else {

      // Senha incorreta
      alert("Senha incorreta");
    }
    // ===============================
    // FIM VALIDAÇÃO
    // ===============================
  }
  // ===============================
  // FIM FUNÇÃO LOGIN
  // ===============================


  // ===============================
  // RENDER DA PÁGINA
  // ===============================
  return (

    <div style={{ padding: 20 }}>

      {/* TÍTULO */}
      <h1>Login Admin</h1>


      {/* FORMULÁRIO DE LOGIN */}
      <form onSubmit={entrar} autoComplete="off">

        {/* INPUT SENHA */}
        <input
          type="password"
          placeholder="Digite a senha"

          // Valor controlado pelo estado
          value={senha}

          // Atualiza estado ao digitar
          onChange={(e) => setSenha(e.target.value)}

          // Evita autocomplete do navegador
          autoComplete="new-password"
        />

        <br /><br />

        {/* BOTÃO DE ENVIO */}
        <button type="submit">
          Entrar
        </button>

      </form>
      {/* ===============================
          FIM FORMULÁRIO
         =============================== */}

    </div>
  );
  // ===============================
  // FIM RENDER
  // ===============================
}
// ===============================
// FIM COMPONENTE LOGIN
// ===============================