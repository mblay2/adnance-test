'use client';

import { useState } from 'react';

export default function StripeConnectButton() {
  const [loading, setLoading] = useState(false);

  const handleStripeConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-stripe-account');

      if (res.redirected) {
        window.location.href = res.url;
      } else {
        const json = await res.json();
        alert(json.error || 'Error desconocido al conectar con Stripe.');
      }
    } catch (err) {
      alert('Error al conectar con Stripe.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStripeConnect}
      disabled={loading}
      className="mt-6 bg-[#32CD32] text-black px-6 py-3 rounded-lg hover:bg-[#2ea62e] transition"
    >
      {loading ? 'Conectando...' : 'Crear cuenta de Stripe'}
    </button>
  );
}
