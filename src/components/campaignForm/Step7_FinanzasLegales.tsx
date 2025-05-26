'use client';

import React, { useEffect, useState } from 'react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  retrocederPaso: () => void;
}

export default function Step7_FinanzasLegales({ formData, setFormData, retrocederPaso }: Props) {
  const [local, setLocal] = useState({
    cuenta_bancaria: '',
    nif: '',
    direccion_fiscal: '',
  });

  useEffect(() => {
    setLocal({
      cuenta_bancaria: formData.cuenta_bancaria || '',
      nif: formData.nif || '',
      direccion_fiscal: formData.direccion_fiscal || '',
    });
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...local, [name]: value };
    setLocal(updated);
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-1">Cuenta bancaria</label>
        <input
          type="text"
          name="cuenta_bancaria"
          value={local.cuenta_bancaria}
          onChange={handleChange}
          placeholder="Ej: ES7620770024003102575766"
          className="w-full px-4 py-2 rounded border border-white/10 bg-[#0a0f0a] text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">NIF / CIF</label>
        <input
          type="text"
          name="nif"
          value={local.nif}
          onChange={handleChange}
          placeholder="Ej: B12345678"
          className="w-full px-4 py-2 rounded border border-white/10 bg-[#0a0f0a] text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Dirección fiscal</label>
        <input
          type="text"
          name="direccion_fiscal"
          value={local.direccion_fiscal}
          onChange={handleChange}
          placeholder="Ej: Calle Falsa 123, Madrid"
          className="w-full px-4 py-2 rounded border border-white/10 bg-[#0a0f0a] text-white"
        />
      </div>

      <div className="text-center mt-8">
        <button
          type="button"
          onClick={retrocederPaso}
          className="px-4 py-2 rounded border border-white/10 text-white hover:bg-white/10"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}
