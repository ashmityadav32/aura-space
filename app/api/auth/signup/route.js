import { NextResponse } from 'next/server';
import { getUsers, hash, startSession } from '@/lib/auth';
import { write } from '@/lib/db';
export async function POST(req) {
  const b = await req.json().catch(() => ({})), name = String(b.name || '').trim(), email = String(b.email || '').trim().toLowerCase(), pw = String(b.password || '');
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Enter a valid name and email.' }, { status: 422 });
  if (pw.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 422 });
  const users = getUsers();
  if (users.some((u) => u.email === email)) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  const u = { id: 'u_' + Date.now().toString(36), name, email, role: 'client', hash: hash(pw), createdAt: new Date().toISOString() };
  write('users', [...users, u]); await startSession(u);
  return NextResponse.json({ name: u.name, role: u.role }, { status: 201 });
}
