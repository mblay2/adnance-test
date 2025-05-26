'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { getSimulatedMetrics } from '@/lib/simulatedCampaigns';

interface Campaign {
  id: string;
  producto_nombre: string;
  producto_tipo: string;
  descripcion_breve: string;
  presupuesto_maximo: number | null;
  presupuesto_minimo: number | null;
  roi_min: number | null;
  roi_max: number | null;
  duracion_dias: number | null;
  verificado?: boolean;
  url_video_anuncio?: string;
  created_at?: string;
}

export default function TiendaDeCampañas() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setCampaigns(data);
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white p-10">
      <h1 className="text-3xl font-bold text-center text-[#32CD32] mb-10">
        🛍️ Campañas disponibles para invertir
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => {
          const metrics = getSimulatedMetrics(c.id);

          const presupuestoMax = c.presupuesto_maximo ?? 0;
          const presupuestoInvertido = Math.floor(presupuestoMax / 2);
          const roiMin = c.roi_min ?? 30;
          const roiMax = c.roi_max ?? 60;

          const youTubeEmbedUrl =
            c.url_video_anuncio?.includes('youtube.com') && c.url_video_anuncio.includes('watch?v=')
              ? c.url_video_anuncio.replace('watch?v=', 'embed/')
              : null;

          return (
            <div
              key={c.id}
              className="bg-[#101510] border border-white/10 rounded-lg p-6 shadow-md flex flex-col justify-between"
            >
              <div>
                {youTubeEmbedUrl && (
                  <div className="mb-4 aspect-video rounded overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={youTubeEmbedUrl}
                      title={`Video de ${c.producto_nombre}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-1 text-[#32CD32]">
                  {c.producto_nombre}
                </h2>
                <p className="text-sm text-gray-400 mb-2">Tipo: {c.producto_tipo}</p>
                <p className="text-sm text-gray-300 mb-4">
                  {c.descripcion_breve?.substring(0, 100)}...
                </p>

                <p className="text-sm mb-1">
                  ROI estimado: <strong>{roiMin}% – {roiMax}%</strong>
                </p>

                <p className="text-sm mb-1">
                  Presupuesto total:{' '}
                  <strong>
                    €{presupuestoInvertido.toLocaleString()}
                  </strong>
                </p>

                <p className="text-sm mb-1">
                  Presupuesto máximo:{' '}
                  <strong>
                    €{presupuestoMax.toLocaleString()}
                  </strong>
                </p>

                <p className="text-sm mb-1">
                  Duración:{' '}
                  <strong>{c.duracion_dias ?? '—'} días</strong>
                </p>

                <p className="text-sm mt-3 text-gray-400">
                  Verificación:{' '}
                  {c.verificado ? (
                    <span className="text-green-500">Verificada</span>
                  ) : (
                    <span className="text-yellow-400">No verificada</span>
                  )}
                </p>

                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <p>📊 Simulación: {metrics.clicks} clics – {metrics.conversions} conversiones</p>
                  <p>💸 CPA: €{metrics.cpa} | ROI: {metrics.roiRange}</p>
                </div>
              </div>

              <div className="flex justify-between gap-2 mt-6">
                <Link href={`/campaigns/${c.id}`}>
                  <button className="w-full border border-white/10 text-white px-4 py-2 rounded hover:bg-white/10 transition">
                    Ver detalles
                  </button>
                </Link>
                <Link href={`/invest/${c.id}`}>
                  <button className="w-full bg-[#32CD32] text-black px-4 py-2 rounded hover:bg-[#2ea62e] transition">
                    Invertir
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
