import { Resend } from 'resend';

export default async function handler(req, res) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'seuemail@gmail.com', // 🔴 COLOQUE SEU EMAIL AQUI
      subject: 'Teste de envio 🚀',
      html: '<h1>Email funcionando!</h1>',
    });

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}