'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LandingPage() {
  const { data: session } = useSession();
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [balanceTotal, setBalanceTotal] = useState('€0');
  const [stripeConnected, setStripeConnected] = useState(false);
  const roiTotal = '43.2%';

  useEffect(() => {
    const fetchInversionesYStripe = async () => {
      if (!session?.user?.email) return;

      const { data: inversiones, error } = await supabase
        .from('panel_de_inversiones')
        .select('campaign_id, cantidad, stripe_account_id')
        .eq('user_email', session.user.email);

      if (!error && inversiones.length > 0) {
        const campañasUnicas = new Set(inversiones.map((i: any) => i.campaign_id));
        const total = inversiones.reduce((acc: number, i: any) => acc + (i.cantidad || 0), 0);
        setCampaignsCount(campañasUnicas.size);
        setBalanceTotal(`€${total}`);

        // Verificar si hay al menos una inversión con cuenta Stripe conectada
        const tieneStripe = inversiones.some((i: any) => !!i.stripe_account_id);
        setStripeConnected(tieneStripe);
      }
    };

    fetchInversionesYStripe();
  }, [session]);

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white">
      {/* 🟢 TOPBAR */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-[#101510]">
        <h1 className="text-xl font-bold text-[#32CD32]">Adnance</h1>
        {session?.user && (
          <div className="flex items-center gap-4">
            {stripeConnected ? (
              <span className="text-sm text-green-400 font-medium">Ya existe una cuenta de Stripe</span>
            ) : (
              <Link href="/api/stripe/create-stripe-account">
                <button className="text-sm px-4 py-2 border border-[#32CD32] text-[#32CD32] rounded hover:bg-[#0f1a0f]">
                  Conectar Stripe
                </button>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* 🟢 HERO */}
      <section className="text-center py-12 px-6">
        <h2 className="text-3xl font-bold mb-3">Invierte en campañas con datos reales</h2>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          La plataforma donde inviertes en campañas de publicidad con retorno transparente, medido y controlado.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/invest">
            <button className="bg-[#32CD32] hover:bg-[#2eb82e] px-6 py-2 text-black font-semibold rounded">
              Explorar campañas
            </button>
          </Link>
          <Link href="/submit">
            <button className="border border-[#32CD32] text-[#32CD32] px-6 py-2 rounded hover:bg-[#0f1a0f]">
              Subir campaña
            </button>
          </Link>
        </div>
      </section>

      {/* 🟢 METRICS */}
      <section className="grid md:grid-cols-3 gap-6 px-6 mb-12">
        <div className="bg-[#101510] p-6 rounded-lg border border-white/10">
          <p className="text-sm text-gray-400">Campañas invertidas</p>
          <p className="text-2xl font-semibold text-[#32CD32] mt-1">{campaignsCount}</p>
        </div>
        <div className="bg-[#101510] p-6 rounded-lg border border-white/10">
          <p className="text-sm text-gray-400">Balance</p>
          <p className="text-2xl font-semibold text-[#32CD32] mt-1">{balanceTotal}</p>
        </div>
        <div className="bg-[#101510] p-6 rounded-lg border border-white/10">
          <p className="text-sm text-gray-400">ROI</p>
          <p className="text-2xl font-semibold text-[#32CD32] mt-1">{roiTotal}</p>
        </div>
      </section>

      {/* 🟢 FUNCIONAMIENTO */}
      <section className="bg-[#101510] p-8 rounded-lg border border-white/10 max-w-5xl mx-auto mb-16">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">¿Cómo funciona?</h3>
        <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-2">1. Subes tu campaña</h4>
            <p>Incluye datos, métricas e historial verificado.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">2. Inversores financian por fases</h4>
            <p>Invierten según rendimiento esperado.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">3. Adnance gestiona y mide</h4>
            <p>La campaña se lanza y el rendimiento se reporta.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
