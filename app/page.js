export default function Home() {
  return (
    <main style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f6f8",
      padding: "40px"
    }}>

      <h1 style={{
        textAlign: "center",
        fontSize: "32px",
        marginBottom: "40px"
      }}>
        Encarte Pro Aves
      </h1>

      {/* PRODUTO 1 */}
      <div style={cardStyle}>
        <img src="/caixa.jpg" style={imgStyle} />

        <h2>Caixa Acústica Profissional</h2>

        <p>
          Caixa acústica para encarte de canto.
          Fabricada em MDF 15mm,
          vidro temperado 8mm (40x40cm),
          alto-falante interno de alto rendimento
          e entradas de áudio laterais.
        </p>

        <h3 style={priceStyle}>R$ 1.500,00</h3>

        <a
          href="https://wa.me/55SEUNUMEROAQUI"
          target="_blank"
          style={buttonStyle}
        >
          Comprar pelo WhatsApp
        </a>
      </div>

      {/* PRODUTO 2 */}
      <div style={cardStyle}>
        <img src="/aparelho.jpg" style={imgStyle} />

        <h2>Aparelho Digital para Encarte</h2>

        <p>
          Programador digital com até 8 programações
          de liga e 8 de desliga.
          Toca MP3 via pendrive e cartão de memória.
          Rádio AM/FM.
          Programação automática 1h toca / 30min descanso.
        </p>

        <h3 style={priceStyle}>R$ 330,00</h3>

        <a
          href="https://wa.me/5511984309480"
          target="_blank"
          style={buttonStyle}
        >
          Comprar pelo WhatsApp
        </a>
      </div>

    </main>
  )
}

const cardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  marginBottom: "40px",
  maxWidth: "500px",
  margin: "0 auto 40px auto",
  textAlign: "center"
}

const imgStyle = {
  width: "100%",
  borderRadius: "10px",
  marginBottom: "15px"
}

const priceStyle = {
  color: "#008000",
  fontSize: "24px",
  margin: "15px 0"
}

const buttonStyle = {
  display: "inline-block",
  backgroundColor: "#25D366",
  color: "white",
  padding: "12px 25px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold"
}
