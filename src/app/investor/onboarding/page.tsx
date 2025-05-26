'use client';

import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
  const { data: session } = useSession();

  const crearCuentaStripe = async () => {
    if (!session?.user?.email) {
      alert('Debes iniciar sesión.');
      return;
    }

    const res = await fetch('/api/stripe/create-account', {
      method: 'POST',
      body: JSON.stringify({ email: session.user.email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // redirige al onboarding de Stripe
    } else {
      alert('Error creando la cuenta de Stripe');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white p-10">
      <h1 className="text-3xl mb-6 font-bold text-[#32CD32]">Activar cuenta de inversión</h1>
      <p className="mb-4">Para poder invertir y recibir beneficios, necesitas una cuenta Stripe Connect.</p>

      <button
        onClick={crearCuentaStripe}
        className="bg-[#32CD32] text-black px-6 py-3 rounded hover:bg-[#28a428]"
      >
        Crear cuenta Stripe
      </button>
    </div>
  );
}
