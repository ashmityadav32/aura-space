import { NextResponse } from 'next/server';
import { getUsers, verify, startSession } from '@/lib/auth';
export async function POST(req) {
  const b = await req.json().catch(() => ({})), u = getUsers().find((x) => x.email === String(b.email || '').trim().toLowerCase());
  if (!u || !verify(String(b.password || ''), u.hash)) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
  await startSession(u); return NextResponse.json({ name: u.name, role: u.role });
}
