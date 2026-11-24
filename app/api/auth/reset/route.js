import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUsers, hash } from '@/lib/auth';
import { read, write } from '@/lib/db';
export async function POST(req) {
  const b = await req.json().catch(() => ({})), pw = String(b.password || '');
  if (pw.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 422 });
  const id = crypto.createHash('sha256').update(String(b.token || '')).digest('hex'), rec = read('resets').find((r) => r.id === id && r.exp > Date.now());
  if (!rec) return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
  write('users', getUsers().map((u) => (u.id === rec.userId ? { ...u, hash: hash(pw) } : u)));
  write('resets', read('resets').filter((r) => r.id !== id)); return NextResponse.json({ ok: true });
}
