'use client';

import { useState, useEffect } from 'react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step3_InfoProducto({ formData, setFormData }: Props) {
  const [local, setLocal] = useState({
    producto_nombre: '',
    producto_tipo: '',
    descripcion_breve: '',
    publico_objetivo: '',
    url_video_anuncio: '',
  });

  useEffect(() => {
    setLocal({
      producto_nombre: formData.producto_nombre || '',
      producto_tipo: formData.producto_tipo || '',
      descripcion_breve: formData.descripcion_breve || '',
      publico_objetivo: formData.publico_objetivo || '',
      url_video_anuncio: formData.url_video_anuncio || '',
    });
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...local, [name]: value };
    setLocal(updated);
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Nombre del producto o servicio</label>
        <input
          name="producto_nombre"
          value={local.producto_nombre}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Tipo de producto (curso, app, software...)</label>
        <input
          name="producto_tipo"
          value={local.producto_tipo}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción breve</label>
        <textarea
          name="descripcion_breve"
          value={local.descripcion_breve}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Público objetivo</label>
        <input
          name="publico_objetivo"
          value={local.publico_objetivo}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">URL del video promocional (YouTube)</label>
        <input
          name="url_video_anuncio"
          type="url"
          value={local.url_video_anuncio}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full p-2 bg-black border border-white/20 rounded"
        />
        {local.url_video_anuncio && !local.url_video_anuncio.includes('youtube.com') && (
          <p className="text-sm text-yellow-500 mt-1">
            ⚠️ Asegúrate de usar un enlace válido de YouTube.
          </p>
        )}
      </div>
    </div>
  );
}
