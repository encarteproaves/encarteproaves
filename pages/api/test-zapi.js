export default async function handler(req, res) {
  try {
    const instance = process.env.ZAPI_INSTANCE_ID?.trim();
    const token = process.env.ZAPI_TOKEN?.trim();
    const phone = process.env.ZAPI_PHONE?.trim();

    console.log("🧪 TESTE ZAPI");
    console.log("INSTANCE:", instance);
    console.log("TOKEN:", token);
    console.log("PHONE:", phone);

    const mensagem = "✅ TESTE DIRETO Z-API FUNCIONANDO";

    const response = await fetch(
      `https://api.z-api.io/instances/${instance}/token/${token}/send-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          message: mensagem,
        }),
      }
    );

    const data = await response.json();

    console.log("📲 RESPOSTA ZAPI:", data);

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("❌ ERRO TESTE:", error);
    return res.status(500).json({ error: "Erro no teste" });
  }
}