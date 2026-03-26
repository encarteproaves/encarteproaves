"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AdminPage() {
const router = useRouter();

useEffect(() => {
  const logado = localStorage.getItem("admin_logado");

  if (logado !== "true") {
    router.push("/admin/login");
  }
}, []);
  return (
    <div>
      <h1>Painel Administrativo</h1>
      <p>Bem-vindo ao painel</p>
    </div>
  );
}
