{/* ÁREA DA IMAGEM PADRONIZADA */}
<div
  style={{
    width: "100%",
    height: "300px",
    backgroundColor:
      product.name === "Aparelho Digital" ? "#ffffff" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  <img
    src={product.image}
    style={{
      width:
        product.name === "Aparelho Digital" ? "auto" : "100%",
      height:
        product.name === "Aparelho Digital" ? "85%" : "100%",
      objectFit:
        product.name === "Aparelho Digital"
          ? "contain"
          : "cover"
    }}
  />
</div>

