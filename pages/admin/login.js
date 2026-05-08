import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginAdmin() {
  const [senhaInserida, setSenhaInserida] = useState("");
  const [erro, setErro] = useState(false);
  const router = useRouter();

  const SENHA_CORRETA = "Ks161269";

  function handleLogin(e) {
    e.preventDefault();
    if (senhaInserida === SENHA_CORRETA) {
      // Salva uma pequena marca no navegador dizendo que você logou
      localStorage.setItem("admin_auth", "true");
      router.push("/admin/pedidos");
    } else {
      setErro(true);
      setSenhaInserida("");
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>Acesso Administrativo</h2>
        <input
          type="password"
          placeholder="Digite a senha"
          value={senhaInserida}
          onChange={(e) => setSenhaInserida(e.target.value)}
          style={styles.input}
        />
        {erro && <p style={{ color: "red" }}>Senha incorreta!</p>}
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" },
  card: { padding: "40px", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" },
  input: { padding: "12px", width: "100%", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }
};