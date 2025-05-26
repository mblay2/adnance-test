'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Inversion {
  id: string;
  campaign_id: string;
  user_email: string;
  cantidad: number;
  fecha: string;
  campaigns?: {
    producto_nombre: string;
    producto_tipo: string;
    url_video_anuncio?: string;
  };
}

export default function InvestmentsPage() {
  const { data: session } = useSession();
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInversiones = async () => {
      if (!session?.user?.email) return;

      const { data, error } = await supabase
        .from('panel_de_inversiones')
        .select('*, campaigns(producto_nombre, producto_tipo, url_video_anuncio)')
        .eq('user_email', session.user.email);

      if (!error && data) setInversiones(data);
      setLoading(false);
    };

    fetchInversiones();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a] text-red-500">
        Debes iniciar sesión para ver tus inversiones.
      </div>
    );
  }

  return (
    <main className="flex-1 p-10">
      <h1 className="text-3xl font-bold text-center text-[#32CD32] mb-6">Portafolio</h1>
      <p className="text-center text-gray-400 mb-10">
        Estas son tus inversiones registradas en campañas publicitarias.
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Cargando inversiones...</p>
      ) : inversiones.length === 0 ? (
        <p className="text-center text-gray-500">Aún no has realizado inversiones.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {inversiones.map((inv, idx) => {
            const roi = [42, 35, 58, 47, 61][idx % 5];
            const clicks = 300 + idx * 47;
            const conversiones = 10 + idx * 3;
            const cpa = (inv.cantidad / (conversiones || 1)).toFixed(2);
            const nombreCampana = inv.campaigns?.producto_nombre || 'Campaña';
            const tipoCampana = inv.campaigns?.producto_tipo || '';
            const video = inv.campaigns?.url_video_anuncio;

            return (
              <div
                key={inv.id}
                className="bg-[#101510] rounded-lg border border-white/10 p-6"
              >
                {video?.includes('youtube.com') && (
                  <div className="mb-4 aspect-video rounded overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={video.replace('watch?v=', 'embed/')}
                      title={`Video de ${nombreCampana}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <p className="text-lg font-semibold text-[#32CD32] mb-2">{nombreCampana}</p>
                <p className="text-sm text-gray-400 mb-1">Tipo: {tipoCampana}</p>
                <p className="text-sm text-gray-400 mb-4">Fecha de inversión: {new Date(inv.fecha).toLocaleDateString()}</p>

                <div className="text-sm space-y-1">
                  <p><span className="text-gray-300">Inversión:</span> €{inv.cantidad}</p>
                  <p><span className="text-gray-300">ROI Estimado:</span> {roi}%</p>
                  <p><span className="text-gray-300">Métricas simuladas:</span> {clicks} Clicks • {conversiones} Conversiones • CPA: €{cpa}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
