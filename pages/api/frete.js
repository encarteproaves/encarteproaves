export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { cep, produtoId } = req.body;

    if (!cep || !produtoId) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    // 🔥 FRETE SIMPLES (GARANTE FUNCIONAMENTO)
    const fretes = [
      { name: "PAC", price: 25.90, prazo: "5 dias" },
      { name: "SEDEX", price: 39.90, prazo: "2 dias" }
    ];

    return res.status(200).json(fretes);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}