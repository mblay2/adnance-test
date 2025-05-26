'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step2_ConectarCuentas({ formData, setFormData }: Props) {
  const { data: session } = useSession();
  const [status, setStatus] = useState({
    googleAds: !!formData.google_ads_conectado,
    analytics: !!formData.google_analytics,
    tagManager: !!formData.tag_manager,
    meta: !!formData.meta_ads,
    tiktok: !!formData.tiktok_ads,
    linkedin: !!formData.linkedin_ads,
    ecommerce: !!formData.ecommerce_connected,
  });

  useEffect(() => {
    setFormData({
      ...formData,
      google_ads_conectado: status.googleAds,
      google_analytics: status.analytics,
      tag_manager: status.tagManager,
      meta_ads: status.meta,
      tiktok_ads: status.tiktok,
      linkedin_ads: status.linkedin,
      ecommerce_connected: status.ecommerce,
    });
  }, [status]);

  const conectarGoogleAds = () => {
    signIn('google');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Conexiones obligatorias y recomendadas</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span>Google Ads (obligatorio)</span>
          <button
            onClick={conectarGoogleAds}
            className={`px-3 py-1 text-sm rounded ${
              status.googleAds ? 'bg-green-700 text-white' : 'bg-white text-black'
            }`}
          >
            {status.googleAds ? 'Conectado' : 'Conectar'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span>Google Analytics</span>
          <button
            disabled
            className="px-3 py-1 text-sm bg-white text-black rounded opacity-50 cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span>Google Tag Manager</span>
          <button
            disabled
            className="px-3 py-1 text-sm bg-white text-black rounded opacity-50 cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span>Meta Ads</span>
          <button
            disabled
            className="px-3 py-1 text-sm bg-white text-black rounded opacity-50 cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span>TikTok Ads</span>
          <button
            disabled
            className="px-3 py-1 text-sm bg-white text-black rounded opacity-50 cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span>Shopify / WooCommerce</span>
          <button
            disabled
            className="px-3 py-1 text-sm bg-white text-black rounded opacity-50 cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        Las conexiones opcionales te permitirán demostrar un historial más sólido y ofrecer mayor transparencia a los inversores.
      </p>
    </div>
  );
}
