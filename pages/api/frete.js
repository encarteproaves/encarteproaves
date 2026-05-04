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
  { name: "Loggi Ponto", price: 14.90, prazo: "5 dias" },
  { name: "PAC", price: 18.90, prazo: "5 dias" },
  { name: "E-commerce", price: 21.40, prazo: "4 dias" },
  { name: "Package", price: 26.00, prazo: "5 dias" },
  { name: "SEDEX", price: 32.90, prazo: "2 dias" },
  { name: "Loggi", price: 37.90, prazo: "3 dias" }
];

// 🔥 sempre ordenado automático
fretes.sort((a, b) => a.price - b.price);

    // 🔥 GARANTIA: ordena do mais barato pro mais caro
    fretes.sort((a, b) => a.price - b.price);

    return res.status(200).json(fretes);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}