'use client';

import { useState, useEffect } from 'react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step1_Identidad({ formData, setFormData }: Props) {
  const [local, setLocal] = useState({
    empresa_nombre: '',
    responsable_nombre: '',
    correo: '',
    pais: '',
    ciudad: '',
    sitio_web: '',
    redes_sociales: '',
  });

  useEffect(() => {
    setLocal({
      empresa_nombre: formData.empresa_nombre || '',
      responsable_nombre: formData.responsable_nombre || '',
      correo: formData.correo || '',
      pais: formData.pais || '',
      ciudad: formData.ciudad || '',
      sitio_web: formData.sitio_web || '',
      redes_sociales: formData.redes_sociales || '',
    });
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...local, [name]: value };
    setLocal(updated);
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Nombre de la empresa o marca</label>
        <input
          name="empresa_nombre"
          value={local.empresa_nombre}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Nombre del responsable</label>
        <input
          name="responsable_nombre"
          value={local.responsable_nombre}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Correo electrónico</label>
        <input
          name="correo"
          type="email"
          value={local.correo}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">País</label>
          <input
            name="pais"
            value={local.pais}
            onChange={handleChange}
            className="w-full p-2 bg-black border border-white/20 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Ciudad</label>
          <input
            name="ciudad"
            value={local.ciudad}
            onChange={handleChange}
            className="w-full p-2 bg-black border border-white/20 rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Sitio web (opcional)</label>
        <input
          name="sitio_web"
          value={local.sitio_web}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Redes sociales (opcional)</label>
        <input
          name="redes_sociales"
          placeholder="https://linkedin.com/in/ejemplo, https://instagram.com/empresa"
          value={local.redes_sociales}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
        />
      </div>
    </div>
  );
}
