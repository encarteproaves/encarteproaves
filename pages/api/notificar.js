import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { pedido } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mensagem = `
🛒 NOVA VENDA REALIZADA

Cliente: ${pedido.nome_cliente}
Telefone: ${pedido.telefone}
CPF: ${pedido.cpf}

Produto: ${pedido.produto}
Valor: R$ ${pedido.valor}
Frete: R$ ${pedido.frete}

Endereço:
${pedido.rua}, ${pedido.numero}
${pedido.bairro}
${pedido.cidade} - ${pedido.estado}
CEP: ${pedido.cep}

Status: ${pedido.status}
`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "🚨 Nova venda no site",
      text: mensagem,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL:", error);
    return res.status(500).json({ error: "Erro ao enviar email" });
  }
}