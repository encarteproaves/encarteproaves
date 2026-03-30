"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const logado = localStorage.getItem("admin_logado");

    if (logado !== "true") {
      router.push("/admin/login");
    }
  }, []);

  return <>{children}</>;
}