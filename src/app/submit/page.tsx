'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Step1_Identidad from '@/components/campaignForm/Step1_Identidad';
import Step2_ConectarCuentas from '@/components/campaignForm/Step2_ConectarCuentas';
import Step3_InfoProducto from '@/components/campaignForm/Step3_InfoProducto';
import Step4_ResumenCampaña from '@/components/campaignForm/Step4_ResumenCampaña';
import Step5_Autorizaciones from '@/components/campaignForm/Step5_Autorizaciones';
import Step6_FinanzasLegales from '@/components/campaignForm/Step6_FinanzasLegales';
import { supabase } from '@/lib/supabaseClient';

const pasos = [
  'Identidad del anunciante',
  'Conexión de cuentas',
  'Producto o servicio',
  'Resumen de campaña',
  'Autorizaciones',
  'Finanzas y datos legales',
];

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const [pasoActual, setPasoActual] = useState(0);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (status === 'unauthenticated') signIn('google');
  }, [status]);

  const avanzarPaso = async () => {
    if (pasoActual === pasos.length - 1) {
      if (!formData.autoriza_metricas || !formData.autoriza_gestion) {
        alert('Debes aceptar los términos obligatorios antes de enviar.');
        return;
      }

      const columnasValidas = [
        'empresa_nombre', 'responsable_nombre', 'correo', 'pais', 'ciudad', 'sitio_web', 'redes_sociales',
        'producto_nombre', 'producto_tipo', 'descripcion_breve', 'publico_objetivo', 'url_video_anuncio',
        'google_ads_conectado', 'google_analytics', 'tag_manager', 'meta_ads', 'tiktok_ads', 'linkedin_ads', 'ecommerce_connected',
        'google_campaign_id', 'presupuesto_maximo',
        'autoriza_metricas', 'autoriza_gestion',
        'cuenta_bancaria', 'nif', 'direccion_fiscal'
      ];

      const cleanData: any = Object.fromEntries(
        Object.entries(formData)
          .filter(([key, value]) =>
            columnasValidas.includes(key) &&
            value !== undefined &&
            value !== null &&
            (typeof value !== 'string' || value.trim() !== '')
          )
          .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      );

      cleanData.correo = session?.user?.email || formData.correo || '';

      try {
        const { error } = await supabase.from('campaigns').insert([cleanData]);
        if (error) throw error;

        const confirmacion = window.confirm('✅ Campaña enviada con éxito.\n¿Quieres subir otra?');
        if (confirmacion) {
          setPasoActual(0);
          setFormData({});
        }
      } catch (err: any) {
        alert(`❌ Error al enviar la campaña:\n${err.message || ''}`);
      }
    } else {
      setPasoActual((prev) => prev + 1);
    }
  };

  const retrocederPaso = () => {
    if (pasoActual > 0) setPasoActual((prev) => prev - 1);
  };

  const autoFillData = () => {
    setFormData({
      empresa_nombre: 'Demo Corp',
      responsable_nombre: 'Marcos Blay',
      correo: 'demo@adnance.com',
      pais: 'España',
      ciudad: 'Madrid',
      sitio_web: 'https://adnance.com',
      redes_sociales: 'https://instagram.com/adnance',
      producto_nombre: 'Curso intensivo de YouTube Ads',
      producto_tipo: 'Curso online',
      descripcion_breve: 'Aprende a dominar campañas de video performance',
      publico_objetivo: 'Marketers, freelancers y agencias',
      url_video_anuncio: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      google_ads_conectado: true,
      google_analytics: false,
      tag_manager: false,
      meta_ads: false,
      tiktok_ads: false,
      linkedin_ads: false,
      ecommerce_connected: false,
      google_campaign_id: 'demo-google-campaign-123',
      presupuesto_maximo: 5000,
      autoriza_metricas: true,
      autoriza_gestion: true,
      cuenta_bancaria: 'ES7620770024003102575766',
      nif: 'B12345678',
      direccion_fiscal: 'Calle Falsa 123, Madrid',
    });
  };

  const renderPaso = () => {
    const props = { formData, setFormData };
    switch (pasoActual) {
      case 0: return <Step1_Identidad {...props} />;
      case 1: return <Step2_ConectarCuentas {...props} />;
      case 2: return <Step3_InfoProducto {...props} />;
      case 3: return <Step4_ResumenCampaña {...props} />;
      case 4: return <Step5_Autorizaciones {...props} />;
      case 5: return <Step6_FinanzasLegales {...props} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-10 bg-[#0a0f0a] text-white">
      <h1 className="text-2xl font-bold mb-2 text-center text-[#32CD32]">Sube tu campaña</h1>
      <p className="text-center text-sm text-gray-300 mb-6">{pasos[pasoActual]}</p>

      <div className="bg-[#101510] rounded-xl shadow-md p-6 mb-6 border border-white/10">
        {renderPaso()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={retrocederPaso}
          disabled={pasoActual === 0}
          className="px-4 py-2 rounded border border-white/10 text-white disabled:opacity-50 hover:bg-white/10"
        >
          Atrás
        </button>
        <button
          onClick={avanzarPaso}
          className="px-4 py-2 rounded bg-[#32CD32] text-black hover:bg-[#2eb82e]"
        >
          {pasoActual === pasos.length - 1 ? 'Subir campaña' : 'Siguiente'}
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={autoFillData}
          className="px-4 py-2 rounded border border-[#32CD32] text-[#32CD32] hover:bg-[#1e2e1e]"
        >
          Rellenar automáticamente (demo)
        </button>
      </div>
    </div>
  );
}
