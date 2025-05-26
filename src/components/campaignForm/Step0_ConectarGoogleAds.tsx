'use client';

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function Step0_ConectarGoogleAds({ onCampaignSelect }: { onCampaignSelect: (campaignId: string) => void }) {
  const { data: session } = useSession();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    const res = await fetch('/api/google/campaigns');
    const data = await res.json();
    setCampaigns(data.campaigns || []);
    setLoading(false);
  };

  useEffect(() => {
    if (session) fetchCampaigns();
  }, [session]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Conectar con Google Ads</h2>
      {!session ? (
        <button onClick={() => signIn('google')} className="bg-green-600 text-white px-4 py-2 rounded">
          Conectar cuenta de Google
        </button>
      ) : (
        <div>
          <p className="mb-2">Selecciona una campaña existente:</p>
          {loading ? <p>Cargando campañas...</p> : (
            <ul>
              {campaigns.map((camp: any) => (
                <li key={camp.id}>
                  <button
                    onClick={() => onCampaignSelect(camp.id)}
                    className="text-left w-full border p-2 my-1 hover:bg-green-100 rounded"
                  >
                    {camp.name} ({camp.status})
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
