'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DetallesCampanaPage() {
  const { id } = useParams();
  const [campana, setCampana] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampana = async () => {
      const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
      if (!error) setCampana(data);
      setLoading(false);
    };
    if (id) fetchCampana();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0a0f0a] text-white p-10">Cargando...</div>;
  if (!campana) return <div className="min-h-screen bg-[#0a0f0a] text-white p-10">Campaña no encontrada.</div>;

  const renderRow = (label: string, value: any) => (
    <tr className="border-b border-white/10">
      <td className="py-2 pr-6 font-medium text-white">{label}</td>
      <td className="py-2 text-gray-300">{value}</td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#32CD32]">Detalles de la Campaña</h1>

      <div className="max-w-5xl mx-auto space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-1">Producto o Servicio</h2>
          <table className="w-full text-sm">
            <tbody>
              {renderRow('Nombre', campana.producto_nombre)}
              {renderRow('Tipo', campana.producto_tipo)}
              {renderRow('Descripción breve', campana.descripcion_breve)}
              {renderRow('Descripción extendida', campana.descripcion_extendida)}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-1">Datos del Anunciante</h2>
          <table className="w-full text-sm">
            <tbody>
              {renderRow('Empresa', campana.empresa_nombre)}
              {renderRow('Responsable', campana.responsable_nombre)}
              {renderRow('Correo', campana.correo)}
              {renderRow('Teléfono', campana.telefono)}
              {renderRow('País / Ciudad', `${campana.pais}, ${campana.ciudad}`)}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-1">Campaña Publicitaria</h2>
          <table className="w-full text-sm">
            <tbody>
              {renderRow('Plataforma principal', campana.plataforma_principal)}
              {renderRow('Presupuesto máximo', `€${campana.presupuesto_maximo}`)}
              {renderRow('Duración (días)', campana.duracion_dias)}
              {renderRow('Fechas', `${campana.fecha_inicio} → ${campana.fecha_fin}`)}
              {renderRow('Objetivo', campana.objetivo_campana)}
              {renderRow('Modelo de optimización', campana.modelo_optimizacion)}
              {renderRow('Tipo de puja', campana.tipo_puja)}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-1">Métricas de Rendimiento</h2>
          <table className="w-full text-sm">
            <tbody>
              {renderRow('CTR medio', `${campana.click_through_rate}%`)}
              {renderRow('CPA medio', `€${campana.costo_por_adquisicion}`)}
              {renderRow('CPC medio', `€${campana.costo_por_clic}`)}
              {renderRow('Tasa de conversión landing', `${campana.tasa_conversion_landing}%`)}
              {renderRow('Resultados orgánicos', campana.resultados_organicos)}
              {renderRow('Historial de campañas previas', campana.historial_publicidad ? 'Sí' : 'No')}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-1">Verificación y ROI</h2>
          <table className="w-full text-sm">
            <tbody>
              {renderRow('Correo verificado', campana.correo_verificado ? 'Sí' : 'No')}
              {renderRow('Autoriza métricas', campana.autoriza_metricas ? 'Sí' : 'No')}
              {renderRow('Autoriza gestión de presupuesto', campana.autoriza_gestion ? 'Sí' : 'No')}
              {renderRow('ROI estimado', `${campana.roi_min}% - ${campana.roi_max}%`)}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-1">Vínculos y Plataformas</h2>
          <table className="w-full text-sm">
            <tbody>
              {renderRow('Landing page', <a href={campana.landing_url} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{campana.landing_url}</a>)}
              {renderRow('Video del anuncio', <a href={campana.url_video_anuncio} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{campana.url_video_anuncio}</a>)}
              {renderRow('Google Ads', campana.google_ads_vinculado)}
              {renderRow('Google Analytics', campana.google_analytics ? 'Conectado' : 'No conectado')}
              {renderRow('Tag Manager', campana.tag_manager ? 'Conectado' : 'No conectado')}
              {renderRow('Meta Ads', campana.meta_ads ? 'Sí' : 'No')}
              {renderRow('TikTok Ads', campana.tiktok_ads ? 'Sí' : 'No')}
              {renderRow('LinkedIn Ads', campana.linkedin_ads ? 'Sí' : 'No')}
              {renderRow('Twitter Ads', campana.twitter_ads ? 'Sí' : 'No')}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
