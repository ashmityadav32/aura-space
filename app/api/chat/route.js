import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { read, write } from '@/lib/db';
export const dynamic = 'force-dynamic';
// A user may only access chats of their own bookings; admins can access all.
async function access(bookingId) {
  const s = await getSession(); if (!s) return [null, 401];
  const b = read('bookings').find((x) => x.id === bookingId);
  return b && (s.role === 'admin' || b.userId === s.id) ? [s, 200] : [null, b ? 403 : 404];
}
export async function GET(req) {
  const id = new URL(req.url).searchParams.get('booking'), [s, code] = await access(id);
  if (!s) return NextResponse.json({ error: 'Not allowed' }, { status: code });
  return NextResponse.json(read('chats').filter((m) => m.bookingId === id));
}
export async function POST(req) {
  const b = await req.json().catch(() => ({})), [s, code] = await access(b.bookingId), text = String(b.text || '').trim().slice(0, 1000);
  if (!s) return NextResponse.json({ error: 'Not allowed' }, { status: code });
  if (!text) return NextResponse.json({ error: 'Empty message' }, { status: 422 });
  write('chats', [...read('chats'), { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), bookingId: b.bookingId, from: s.role === 'admin' ? 'admin' : 'client', name: s.role === 'admin' ? 'Your designer' : s.name, text, at: new Date().toISOString() }]);
  return NextResponse.json({ ok: true }, { status: 201 });
}
