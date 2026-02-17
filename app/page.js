{/* IMAGEM PADRONIZADA */}
<div
  style={{
    height: "260px",            // 🔥 altura fixa igual para os dois
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      product.name === "Aparelho Digital" ? "#ffffff" : "transparent",
    padding: "20px"
  }}
>
  <img
    src={product.image}
    style={{
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain"
    }}
  />
</div>
