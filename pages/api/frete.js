export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { cep, produtoId } = req.body;

    if (!cep || !produtoId) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    // ===============================
    // FRETES (5 OPÇÕES ORDENADAS)
    // ===============================
    let fretes = [
      { name: "Econômico", price: 19.90, prazo: "7 dias" },
      { name: "PAC", price: 24.90, prazo: "5 dias" },
      { name: "Transportadora", price: 29.90, prazo: "4 dias" },
      { name: "SEDEX", price: 39.90, prazo: "2 dias" },
      { name: "Expresso", price: 49.90, prazo: "1 dia" }
    ];

    // 🔥 GARANTIA: ordena do mais barato pro mais caro
    fretes.sort((a, b) => a.price - b.price);

    return res.status(200).json(fretes);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}