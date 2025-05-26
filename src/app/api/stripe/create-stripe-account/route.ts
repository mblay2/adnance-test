import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe'; // usa el cliente centralizado si ya lo tienes
import { supabase } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const { data, error } = await supabase
    .from('usuarios')
    .select('stripe_account_id')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('❌ Error consultando Supabase:', error.message);
    return NextResponse.json({ error: 'Error consultando la base de datos' }, { status: 500 });
  }

  if (data?.stripe_account_id) {
    return NextResponse.redirect(`${baseUrl}/invest`);
  }

  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
    });

    const { error: upsertError } = await supabase
      .from('usuarios')
      .upsert({
        email,
        stripe_account_id: account.id,
      });

    if (upsertError) {
      console.error('❌ Error guardando cuenta en Supabase:', upsertError.message);
      return NextResponse.json({ error: 'Error guardando cuenta en base de datos' }, { status: 500 });
    }

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/invest`,
      return_url: `${baseUrl}/invest`,
      type: 'account_onboarding',
    });

    return NextResponse.redirect(accountLink.url);
  } catch (err: any) {
    console.error('❌ Error completo en Stripe:', err);
    return NextResponse.json({ error: err.message || 'Error creando cuenta en Stripe' }, { status: 500 });
  }
}
