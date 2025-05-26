'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from 'next-auth/react';
import { getSimulatedMetrics } from '@/lib/simulatedCampaigns';

export default function InvertirPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [campana, setCampana] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [montoTotal, setMontoTotal] = useState(0);
  const [montosPorBloque, setMontosPorBloque] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    const fetchCampana = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setCampana(data);
      setLoading(false);
    };
    if (id && status === 'authenticated') fetchCampana();
  }, [id, status]);

  if (status === 'loading' || loading)
    return <div className="p-6 text-white bg-[#0a0f0a]">Cargando...</div>;
  if (!campana)
    return <div className="p-6 text-white bg-[#0a0f0a]">Campaña no encontrada.</div>;

  const metrics = getSimulatedMetrics(campana.id);

  const presupuestoMaximo = Number(campana.presupuesto_maximo) || 1;
  const presupuestoMinimo = Number(campana.presupuesto_minimo) || 0;
  const duracionDias = Number(campana.duracion_dias) || 14;

  const [roiMin, roiMax] = (() => {
    const match = metrics.roiRange.match(/(\d+)%\s*–\s*(\d+)%/);
    return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0];
  })();

  const diasPorBloque = duracionDias / 4;
  const presupuestoMinBloque = presupuestoMinimo / 4;
  const presupuestoMaxBloque = presupuestoMaximo / 4;

  const bloques = Array.from({ length: 4 }, (_, i) => {
    const presupuestoActual = presupuestoMinBloque + montosPorBloque[i];
    const presupuestoDiarioActual = presupuestoActual / diasPorBloque;
    return {
      numero: i + 1,
      presupuestoActual,
      presupuestoMax: presupuestoMaxBloque,
      presupuestoDiarioActual,
      roiMin,
      roiMax,
    };
  });

  const beneficioMin = montoTotal * (roiMin / 100);
  const beneficioMax = montoTotal * (roiMax / 100);
  const retornoMin = montoTotal + beneficioMin;
  const retornoMax = montoTotal + beneficioMax;

  const actualizarMontoBloque = (index: number, valor: number) => {
    const nuevosMontos = [...montosPorBloque];
    const nuevoTotal = presupuestoMinBloque + valor;
    if (nuevoTotal > presupuestoMaxBloque) {
      alert(`Este bloque ha alcanzado su máximo de €${presupuestoMaxBloque.toFixed(2)}.`);
      return;
    }
    nuevosMontos[index] = valor;
    setMontosPorBloque(nuevosMontos);
  };

  const verificarCuentaStripe = async () => {
    const email = session?.user?.email;
    if (!email) return false;

    const { data, error } = await supabase
      .from('usuarios') // ⚠️ NUEVA tabla
      .select('stripe_account_id')
      .eq('email', email)
      .single();

    if (error || !data?.stripe_account_id) {
      router.push('/api/stripe/create-stripe-account');
      return false;
    }

    return true;
  };

  const registrarInversion = async (bloqueIndex: number, cantidad: number) => {
    const cuentaVerificada = await verificarCuentaStripe();
    if (!cuentaVerificada) return;

    const { error } = await supabase.from('panel_de_inversiones').insert({
      campaign_id: id,
      user_email: session?.user?.email,
      cantidad,
      bloque: bloqueIndex + 1,
      roi_estimado_min: roiMin,
      roi_estimado_max: roiMax,
      created_at: new Date().toISOString(),
    });

    if (error) {
      alert('Error al registrar la inversión.');
      console.error(error);
    } else {
      alert(`Inversión registrada en el bloque ${bloqueIndex + 1} por €${cantidad}`);
    }
  };

  const manejarInversionTotal = async () => {
    const cuentaVerificada = await verificarCuentaStripe();
    if (!cuentaVerificada) return;

    const totalPresupuestoActual =
      presupuestoMinimo + montosPorBloque.reduce((acc, m) => acc + m, 0) + montoTotal;

    if (totalPresupuestoActual > presupuestoMaximo) {
      alert(`La campaña ya ha alcanzado su presupuesto máximo de €${presupuestoMaximo.toFixed(2)}.`);
      return;
    }

    const montoPorBloque = montoTotal / 4;
    for (let i = 0; i < 4; i++) {
      await registrarInversion(i, montoPorBloque);
    }

    alert(`Inversión total de €${montoTotal} registrada correctamente.`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white p-8">
      <h1 className="text-2xl font-bold text-center text-[#32CD32] mb-4">
        Invertir en: {campana.producto_nombre}
      </h1>

      {/* Métricas simuladas */}
      <div className="mt-6 mb-10 bg-[#101510] border border-white/10 p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 text-[#32CD32]">📊 Rendimiento estimado (simulado)</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Clics:</strong> {metrics.clicks}</div>
          <div><strong>Impresiones:</strong> {metrics.impressions}</div>
          <div><strong>CTR:</strong> {metrics.ctr}%</div>
          <div><strong>CPC:</strong> €{metrics.cpc}</div>
          <div><strong>CPA:</strong> €{metrics.cpa}</div>
          <div><strong>Conversiones:</strong> {metrics.conversions}</div>
          <div><strong>Tasa de conversión:</strong> {metrics.conversionRate}%</div>
          <div><strong>ROI estimado:</strong> {roiMin}% – {roiMax}%</div>
          <div><strong>Inversión simulada:</strong> €{metrics.invested}</div>
          <div><strong>Ingresos estimados:</strong> €{metrics.revenue}</div>
        </div>
      </div>

      {/* Bloques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bloques.map((bloque, i) => {
          const monto = montosPorBloque[i];
          const retornoMinBloque = monto + monto * (bloque.roiMin / 100);
          const retornoMaxBloque = monto + monto * (bloque.roiMax / 100);
          const disponible = bloque.presupuestoMax - bloque.presupuestoActual;

          return (
            <div key={bloque.numero} className="bg-[#101510] border border-white/10 rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold text-[#32CD32] mb-2">Bloque {bloque.numero}</h2>
              <p>Presupuesto actual: €{bloque.presupuestoActual.toFixed(2)}</p>
              <p>Límite: €{bloque.presupuestoMax.toFixed(2)}</p>
              <p>Diario estimado: €{bloque.presupuestoDiarioActual.toFixed(2)}</p>
              <p>ROI estimado: {bloque.roiMin}% – {bloque.roiMax}%</p>

              <input
                type="number"
                min={0}
                max={disponible}
                value={monto}
                onChange={(e) => actualizarMontoBloque(i, Number(e.target.value))}
                className="mt-3 w-full bg-[#0a0f0a] border border-white/20 rounded px-3 py-2 text-white"
                placeholder="Cantidad a invertir"
              />

              {monto > 0 && (
                <p className="mt-2 text-sm text-gray-400">
                  Retorno estimado: €{retornoMinBloque.toFixed(2)} – €{retornoMaxBloque.toFixed(2)}
                </p>
              )}

              <button
                className="mt-3 w-full bg-[#32CD32] text-black py-2 rounded hover:bg-[#2eb82e]"
                onClick={() => registrarInversion(i, monto)}
              >
                Invertir en este bloque
              </button>
            </div>
          );
        })}
      </div>

      {/* Inversión total */}
      <div className="mt-12 bg-[#101510] p-6 rounded-lg shadow max-w-xl mx-auto border border-white/10">
        <h2 className="text-xl font-bold text-center text-[#32CD32] mb-4">ROI total estimado</h2>
        <p className="text-center mb-2">
          Presupuesto actual: €{(presupuestoMinimo + montosPorBloque.reduce((acc, m) => acc + m, 0)).toFixed(2)}
        </p>
        <p className="text-center mb-2">
          Límite permitido: €{presupuestoMaximo.toFixed(2)}
        </p>
        <p className="text-center mb-4">
          ROI: {roiMin}% – {roiMax}%
        </p>

        <input
          type="number"
          min={0}
          max={presupuestoMaximo - (presupuestoMinimo + montosPorBloque.reduce((acc, m) => acc + m, 0))}
          className="w-full mb-4 bg-[#0a0f0a] border border-white/20 rounded px-3 py-2 text-center text-white"
          value={montoTotal}
          onChange={(e) => setMontoTotal(Number(e.target.value))}
          placeholder="Cantidad total a invertir"
        />

        {montoTotal > 0 && (
          <p className="text-center text-sm text-gray-400 mb-4">
            Retorno estimado: €{retornoMin.toFixed(2)} – €{retornoMax.toFixed(2)}
          </p>
        )}

        <button
          className="w-full bg-[#32CD32] text-black py-2 rounded hover:bg-[#2eb82e]"
          onClick={manejarInversionTotal}
        >
          Invertir en toda la campaña
        </button>
      </div>
    </div>
  );
}
