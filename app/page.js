"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ fontFamily: "Arial", background: "#f3f3f3" }}>

      {/* HEADER */}
      <header style={{
        backgroundColor: "#131921",
        padding: "15px 40px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ color: "#f0c14b" }}>Encarte Pro Aves</h2>
        <div>Atendimento Profissional</div>
      </header>

      {/* PRODUTOS */}
      <section style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        padding: "60px 20px",
        flexWrap: "wrap"
      }}>

        <Link href="/caixa" style={{ textDecoration: "none", color: "black" }}>
          <div style={{
            background: "#fff",
            width: "300px",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            transition: "0.3s"
          }}>
            <img src="/caixa.jpg" style={{ width: "100%" }} />
            <h3>Caixa Acústica Profissional</h3>
            <p style={{ color: "#555" }}>⭐⭐⭐⭐⭐ (27 avaliações)</p>
            <h2 style={{ color: "#B12704" }}>R$ 1.500,00</h2>
            <p>12x de R$ 125,00</p>
          </div>
        </Link>

        <Link href="/aparelho" style={{ textDecoration: "none", color: "black" }}>
          <div style={{
            background: "#fff",
            width: "300px",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            transition: "0.3s"
          }}>
            <img src="/aparelho.jpg" style={{ width: "100%" }} />
            <h3>Aparelho Digital Programável</h3>
            <p style={{ color: "#555" }}>⭐⭐⭐⭐⭐ (18 avaliações)</p>
            <h2 style={{ color: "#B12704" }}>R$ 330,00</h2>
            <p>6x de R$ 55,00</p>
          </div>
        </Link>

      </section>

    </main>
  );
}
