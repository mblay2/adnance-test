'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabaseClient';

export default function StripeCallbackPage() {
  const { data: session } = useSession();
  const [status, setStatus] = useState('Cargando...');

  useEffect(() => {
    const guardarCuentaStripe = async () => {
      if (!session?.user?.email) {
        setStatus('Debes iniciar sesión.');
        return;
      }

      // ⚠️ Suponemos que ya tienes guardado el stripeAccountId en backend al crear la cuenta.
      // Aquí solo lo confirmamos o lo reconsultamos si quieres.

      const res = await fetch('/api/stripe/get-account-id', {
        method: 'POST',
        body: JSON.stringify({ email: session.user.email }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.accountId) {
        // Guardar en Supabase
        const { error } = await supabase
          .from('usuarios') // o tu tabla de inversores
          .update({ stripe_account_id: data.accountId })
          .eq('correo', session.user.email);

        if (error) {
          setStatus('Error al guardar Stripe ID en la base de datos.');
        } else {
          setStatus('Cuenta Stripe vinculada correctamente ✅');
        }
      } else {
        setStatus('No se pudo obtener tu cuenta de Stripe.');
      }
    };

    guardarCuentaStripe();
  }, [session]);

  return (
    <div className="min-h-screen p-10 bg-[#0a0f0a] text-white text-center">
      <h1 className="text-2xl font-bold text-[#32CD32] mb-4">Finalizando configuración</h1>
      <p>{status}</p>
    </div>
  );
}
