'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getSimulatedMetrics } from '@/lib/simulatedCampaigns';

interface Inversion {
  id: string;
  campaign_id: string;
  user_email: string;
  cantidad: number;
  fecha: string;
}

export default function DashboardAnunciante() {
  const { data: session } = useSession();
  const [campanas, setCampanas] = useState<any[]>([]);
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [campanaActiva, setCampanaActiva] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;

      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('correo', session.user.email);

      const { data: inversionesData } = await supabase
        .from('panel_de_inversiones')
        .select('*');

      setCampanas(campaignsData || []);
      setInversiones(inversionesData || []);
      setLoading(false);
    };

    fetchData();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a] text-red-500">
        Debes iniciar sesión como anunciante.
      </div>
    );
  }

  return (
    <main className="flex-1 p-10 bg-[#0a0f0a] text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-[#32CD32] mb-8">Mis campañas subidas</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando campañas...</p>
      ) : campanas.length === 0 ? (
        <p className="text-center text-gray-400">Aún no has subido ninguna campaña.</p>
      ) : (
        <div className="space-y-10 max-w-5xl mx-auto">
          {campanas.map((campana) => {
            const inversionesCampana = inversiones.filter(
              (inv) => inv.campaign_id === campana.id
            );
            const totalInversiones = inversionesCampana.reduce((acc, inv) => acc + (inv.cantidad || 0), 0);
            const totalInvertido = (campana.presupuesto_minimo || 0) + totalInversiones;

            // Métricas simuladas
            const metrics = getSimulatedMetrics(campana.id);

            return (
              <div key={campana.id} className="bg-[#101510] border border-white/10 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-2 text-[#32CD32]">{campana.producto_nombre}</h2>
                <p className="text-sm text-gray-400 mb-4">Campaña ID: {campana.id}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <p>Tipo de producto: {campana.producto_tipo}</p>
                  <p>Público objetivo: {campana.publico_objetivo}</p>
                  <p>Objetivo presupuestario: €{campana.presupuesto_maximo?.toLocaleString()}</p>
                  <p>Total invertido: €{totalInvertido.toLocaleString()}</p>
                  <p>ROI estimado: {metrics.roiRange}</p>
                  <p>Plataforma principal: {campana.plataforma_principal}</p>
                  <p>Sitio web: <a href={campana.sitio_web} target="_blank" className="text-blue-400 underline">{campana.sitio_web}</a></p>
                  <p>Duración: {campana.fecha_inicio} a {campana.fecha_fin}</p>
                  <p>Redes sociales: {campana.redes_sociales}</p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setCampanaActiva(campanaActiva === campana.id ? null : campana.id)}
                    className="mt-4 text-sm px-4 py-2 border border-[#32CD32] text-[#32CD32] rounded hover:bg-[#0f1a0f]"
                  >
                    {campanaActiva === campana.id ? 'Ocultar métricas' : 'Ver métricas de rendimiento'}
                  </button>

                  {campanaActiva === campana.id && (
                    <div className="mt-4 text-sm space-y-1 text-gray-300">
                      <p>Impresiones: {metrics.impressions.toLocaleString()}</p>
                      <p>Clics: {metrics.clicks.toLocaleString()}</p>
                      <p>CTR: {metrics.ctr}%</p>
                      <p>Conversiones: {metrics.conversions}</p>
                      <p>Tasa de conversión: {metrics.conversionRate}%</p>
                      <p>CPC promedio: €{metrics.cpc}</p>
                      <p>CPA promedio: €{metrics.cpa}</p>
                      <p>Ingresos estimados: €{metrics.revenue}</p>
                    </div>
                  )}
                </div>

                {inversionesCampana.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Inversiones recibidas:</h3>
                    <ul className="text-sm text-white space-y-1">
                      {inversionesCampana.map((inv) => (
                        <li key={inv.id}>
                          {inv.user_email} → €{inv.cantidad} el {new Date(inv.fecha).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
