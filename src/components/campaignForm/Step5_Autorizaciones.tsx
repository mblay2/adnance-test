'use client';

import { useEffect, useState } from 'react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step5_Autorizaciones({ formData, setFormData }: Props) {
  const [local, setLocal] = useState({
    autoriza_gestion: false,
    autoriza_metricas: false,
  });

  useEffect(() => {
    setLocal({
      autoriza_gestion: !!formData.autoriza_gestion,
      autoriza_metricas: !!formData.autoriza_metricas,
    });
  }, [formData]);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updated = { ...local, [name]: checked };
    setLocal(updated);
    setFormData({ ...formData, [name]: checked });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Autorizaciones</h2>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="autoriza_gestion"
          checked={local.autoriza_gestion}
          onChange={handleCheck}
          className="mt-1"
        />
        <label className="text-sm">
          Autorizo a Adnance a gestionar el 100% del presupuesto publicitario de esta campaña y usar mi cuenta de Google Ads para lanzar anuncios en mi nombre.
        </label>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="autoriza_metricas"
          checked={local.autoriza_metricas}
          onChange={handleCheck}
          className="mt-1"
        />
        <label className="text-sm">
          Confirmo que los datos proporcionados son verídicos y autorizo el acceso a métricas para validación y análisis de rendimiento.
        </label>
      </div>

      <p className="text-xs text-gray-400">
        Estas autorizaciones son necesarias para garantizar la transparencia del modelo de inversión y proteger a los inversores.
      </p>
    </div>
  );
}
