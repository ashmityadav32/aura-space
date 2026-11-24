import { NextResponse } from 'next/server';
import { read, write } from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function POST(req) {
  const b = await req.json().catch(() => ({})), name = String(b.name || '').trim(), email = String(b.email || '').trim(), message = String(b.message || '').trim();
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) return NextResponse.json({ error: 'Please fill in all fields (message at least 10 characters).' }, { status: 422 });
  write('messages', [...read('messages'), { id: Date.now().toString(36), name, email, message: message.slice(0, 2000), createdAt: new Date().toISOString() }]);
  return NextResponse.json({ ok: true }, { status: 201 });
}
export async function GET() {
  const s = await getSession(); if (s?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json(read('messages').reverse());
}
