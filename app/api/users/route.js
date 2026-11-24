import { NextResponse } from 'next/server';
import { getSession, getUsers } from '@/lib/auth';
import { read } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() { // admin only; password hashes are never returned
  const s = await getSession(); if (s?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const bookings = read('bookings');
  return NextResponse.json(getUsers().filter((u) => u.role === 'client').map(({ hash, ...u }) => ({ ...u, bookings: bookings.filter((b) => b.userId === u.id).length })).reverse());
}
