'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [senha, setSenha] = useState('')
  const router = useRouter()

  function handleLogin() {
    if (senha === '123') { // você pode mudar a senha depois
      // ✅ cria o cookie
      document.cookie = "admin-auth=true; path=/; max-age=86400"

      // ✅ redireciona para admin
      router.push('/admin')
    } else {
      alert('Senha incorreta')
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Digite a senha"
      />

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  )
}