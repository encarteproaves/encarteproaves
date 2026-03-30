'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  // 🔐 PROTEÇÃO
  useEffect(() => {
    const cookies = document.cookie

    if (!cookies.includes('admin-auth=true')) {
      router.push('/admin/login')
    }
  }, [])

  // 🚪 LOGOUT
  function sair() {
    document.cookie = "admin-auth=; path=/; max-age=0"
    router.push('/admin/login')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Painel Administrativo</h1>

      <p>Bem-vindo ao painel</p>

      <button onClick={sair}>
  Sair
</button>

<br /><br />

<button onClick={() => router.push('/admin/produtos')}>
  Ir para Produtos
</button>
    </div>
  )
}