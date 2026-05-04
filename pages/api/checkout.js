import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { items, customerEmail, customerName, shippingCep, shippingCost, phoneNumber } = req.body;

    // 1. Gerar uma referência única (Seu webhook usa isso para achar o pedido)
    const externalReference = `ORD-${Date.now()}`;
    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0) + (shippingCost || 0);

    // 2. Criar o pedido no Supabase (Ajustado às suas colunas da Captura 1396)
    const { error: dbError } = await supabase
      .from('pedidos')
      .insert([
        {
          external_reference: externalReference,
          nome_cliente: customerName,
          email: customerEmail,
          telefone: phoneNumber,
          cep: shippingCep,
          frete: shippingCost,
          valor: totalAmount, // Campo 'valor' conforme seu webhook busca
          produto: items[0].name, // Seu webhook espera uma string no campo 'produto'
          status: 'Pendente',
        },
      ]);

    if (dbError) throw new Error(`Erro Supabase: ${dbError.message}`);

    // 3. Criar Preferência no Mercado Pago
    const preference = new Preference(client);
    const body = {
      items: items.map((item) => ({
        id: item.id,
        title: item.name,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
        currency_id: 'BRL',
      })),
      payer: { email: customerEmail },
      back_urls: {
        success: `${req.headers.origin}/sucesso`,
        failure: `${req.headers.origin}/carrinho`,
      },
      auto_return: "approved",
      // CRUCIAL: Passar a referência que o seu webhook vai procurar depois
      external_reference: externalReference,
      // URL do seu webhook existente
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
    };

    const result = await preference.create({ body });

    return res.status(200).json({ id: result.id, init_point: result.init_point });

  } catch (error) {
    console.error('Erro Checkout:', error);
    return res.status(500).json({ error: error.message });
  }
}