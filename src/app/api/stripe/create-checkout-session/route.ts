import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const body = await req.json();
  const { campaignId, block, amount } = body;

  if (!campaignId || !block || !amount || amount < 100) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  }

  try {
    // 1. Registrar intención de inversión en Supabase
    await supabase.from('panel_de_inversiones').insert({
      campaign_id: campaignId,
      user_email: email,
      bloque: block,
      cantidad: amount / 100,
      created_at: new Date().toISOString(),
      roi_estimado_min: 0, // opcional: puedes calcular esto antes
      roi_estimado_max: 0,
    });

    // 2. Crear sesión de pago en Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Inversión en campaña ${campaignId} - bloque ${block}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/investments?success=true`,
      cancel_url: `${baseUrl}/investments?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('❌ Error creando sesión de pago:', err);
    return NextResponse.json({ error: err.message || 'Error creando sesión' }, { status: 500 });
  }
}
