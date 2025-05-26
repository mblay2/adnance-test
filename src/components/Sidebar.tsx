'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  return (
    <aside className="w-[13.5rem] bg-[#0a0f0a] p-6 border-r border-white/10 hidden md:flex flex-col justify-between">
      <div>
        {/* Logo como botón a la landing page */}
        <Link href="/">
          <Image
            src="/logo-adnance.png"
            alt="Adnance"
            width={120}
            height={30}
            className="mb-10 cursor-pointer hover:opacity-80 transition"
          />
        </Link>

        <nav className="space-y-3 text-sm">
          <Link href="/investments">
            <div className="px-4 py-2 rounded bg-white/5 hover:bg-[#32CD32] hover:text-black transition">
              Portafolio
            </div>
          </Link>
          <Link href="/dashboard-anunciante">
            <div className="px-4 py-2 rounded bg-white/5 hover:bg-[#32CD32] hover:text-black transition">
              Mis campañas
            </div>
          </Link>
        </nav>
      </div>

      <button
        onClick={() => signOut()}
        className="text-sm px-4 py-2 rounded border border-white/20 hover:bg-white/5 transition"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
