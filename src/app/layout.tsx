import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Sidebar from '@/components/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Adnance',
  description: 'Plataforma de inversión en campañas publicitarias',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#0a0f0a] text-white">
        <Providers>
          <div className="min-h-screen flex">
            <Sidebar />
            <main className="flex-1 p-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
