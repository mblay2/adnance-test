'use client';

import { useState, useEffect } from 'react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step6_FinanzasLegales({ formData, setFormData }: Props) {
  const [local, setLocal] = useState({
    nif: '',
    cuenta_bancaria: '',
    direccion_fiscal: '',
  });

  useEffect(() => {
    setLocal({
      nif: formData.nif || '',
      cuenta_bancaria: formData.cuenta_bancaria || '',
      direccion_fiscal: formData.direccion_fiscal || '',
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
      <h2 className="text-lg font-semibold">Datos fiscales y bancarios</h2>

      <div>
        <label className="block text-sm mb-1">NIF / CIF</label>
        <input
          name="nif"
          value={local.nif}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Cuenta bancaria (IBAN)</label>
        <input
          name="cuenta_bancaria"
          value={local.cuenta_bancaria}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Dirección fiscal</label>
        <textarea
          name="direccion_fiscal"
          value={local.direccion_fiscal}
          onChange={handleChange}
          className="w-full p-2 bg-black border border-white/20 rounded"
          rows={2}
          required
        />
      </div>
    </div>
  );
}
