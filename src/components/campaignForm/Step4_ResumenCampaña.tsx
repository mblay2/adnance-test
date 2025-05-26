'use client';

import { useEffect, useState } from 'react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step4_ResumenCampaña({ formData, setFormData }: Props) {
  const [loading, setLoading] = useState(true);
  const [campanas, setCampanas] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampanas = async () => {
      try {
        const res = await fetch('/api/google/campaigns');
        const data = await res.json();
        if (res.ok) {
          setCampanas(data.campaigns);
        } else {
          setError(data.error || 'Error al cargar campañas');
        }
      } catch (err) {
        setError('Error de conexión con la API');
      } finally {
        setLoading(false);
      }
    };
    fetchCampanas();
  }, []);

  const seleccionarCampana = (campana: any) => {
    setFormData({
      ...formData,
      google_campaign_id: campana.campaign.id,
    });
  };

  const handlePresupuestoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      presupuesto_maximo: parseFloat(e.target.value),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Resumen de campañas conectadas</h2>

        {loading && <p className="text-sm text-gray-400">Cargando campañas desde Google Ads...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && campanas.length === 0 && (
          <p className="text-sm text-yellow-500">No se encontraron campañas activas.</p>
        )}

        {!loading && campanas.length > 0 && (
          <ul className="space-y-2">
            {campanas.map((item, idx) => (
              <li
                key={idx}
                className={`p-3 border rounded cursor-pointer bg-black border-white/10 hover:border-green-500 ${
                  formData.google_campaign_id === item.campaign.id ? 'border-green-500' : ''
                }`}
                onClick={() => seleccionarCampana(item)}
              >
                <p><strong>ID:</strong> {item.campaign.id}</p>
                <p><strong>Nombre:</strong> {item.campaign.name}</p>
                <p><strong>Estado:</strong> {item.campaign.status}</p>
                <p><strong>Inicio:</strong> {item.campaign.startDate}</p>
                <p><strong>Fin:</strong> {item.campaign.endDate}</p>
              </li>
            ))}
          </ul>
        )}

        {formData.google_campaign_id && (
          <p className="text-sm text-green-400 mt-2">
            ✅ Campaña seleccionada: {formData.google_campaign_id}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium">Presupuesto máximo para esta campaña</label>
        <p className="text-sm text-gray-400 mb-2">
          Este valor nos permite establecer un límite de inversión en tu campaña. Adnance usará este
          dato para garantizar que no se supere el presupuesto total, incluyendo la inversión que
          tú ya hayas realizado desde Google Ads.
        </p>
        <input
          type="number"
          min={0}
          step={1}
          placeholder="Ej. 5000"
          value={formData.presupuesto_maximo || ''}
          onChange={handlePresupuestoChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
        />
      </div>
    </div>
  );
}
