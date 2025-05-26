'use client';

import { useState } from 'react';

interface Props {
  roiMin: number;
  roiMax: number;
}

export default function SimuladorInversion({ roiMin, roiMax }: Props) {
  const [monto, setMonto] = useState(100);

  const resultadoMin = ((roiMin / 100) * monto + monto).toFixed(2);
  const resultadoMax = ((roiMax / 100) * monto + monto).toFixed(2);

  return (
    <div className="mt-6 p-4 bg-white rounded shadow">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        ¿Cuánto quieres invertir? (€)
      </label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(Number(e.target.value))}
        className="w-full p-2 border rounded mb-4"
      />
      <p>🔍 Retorno estimado: <strong>€{resultadoMin}</strong> – <strong>€{resultadoMax}</strong></p>
    </div>
  );
}
