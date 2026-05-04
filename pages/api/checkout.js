import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

// Inicializa o Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Nome exato da sua Vercel
});

// Inicializa o Supabase (Service Role é melhor aqui para bypass de RLS no backend)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { items, customerEmail, userId } = req.body;

    // 1. Calcular o total para salvar no banco
    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 2. Criar o registro do pedido no Supabase primeiro
    // Certifique-se de ter uma tabela chamada 'pedidos'
    // Dentro do handler no checkout.js
const { data: order, error: dbError } = await supabase
  .from('pedidos')
  .insert([
    {
      nome_cliente: customerName, // Ajustado para sua coluna
      email: customerEmail,
      total: totalAmount,
      status: 'pendente',
      cep: shippingCep, // Se você já estiver capturando o CEP no front
      frete: shippingCost, // Valor do frete calculado
      external_reference: `REF_${Date.now()}` 
    },
  ])
  .select()
  .single();

    if (dbError) throw new Error(`Erro no Supabase: ${dbError.message}`);

    // 3. Criar a Preferência no Mercado Pago
    const preference = new Preference(client);
    
    const body = {
      items: items.map((item) => ({
        id: item.id,
        title: item.name,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
        currency_id: 'BRL',
      })),
      payer: {
        email: customerEmail,
      },
      back_urls: {
        success: `${req.headers.origin}/sucesso`,
        failure: `${req.headers.origin}/carrinho`,
        pending: `${req.headers.origin}/pendente`,
      },
      auto_return: "approved",
      // Metadata é o segredo: passamos o ID do pedido do Supabase para o Mercado Pago
      // Assim, o Webhook saberá exatamente qual pedido atualizar depois.
      metadata: {
        supabase_order_id: order.id,
      },
      // URL que o Mercado Pago vai chamar para avisar do pagamento
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
    };

    const result = await preference.create({ body });

    // 4. Retornar o link de pagamento e o ID para o Frontend
    return res.status(200).json({ 
      id: result.id, 
      init_point: result.init_point 
    });

  } catch (error) {
    console.error('Checkout Error:', error);
    return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
  }
}