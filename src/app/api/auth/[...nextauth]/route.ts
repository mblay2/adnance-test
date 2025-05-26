import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// NO exportes authOptions aquí directamente
const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
