import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { read, write } from '@/lib/db';
const ok = async () => (await getSession())?.role === 'admin';
export async function PATCH(_, { params }) {
  if (!(await ok())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  write('messages', read('messages').map((m) => (m.id === params.id ? { ...m, read: true } : m))); return NextResponse.json({ ok: true });
}
export async function DELETE(_, { params }) {
  if (!(await ok())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  write('messages', read('messages').filter((m) => m.id !== params.id)); return NextResponse.json({ ok: true });
}
