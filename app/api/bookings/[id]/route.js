import { NextResponse } from 'next/server';
import { read, write } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { PHASES } from '@/lib/pricing';
const admin = async () => (await getSession())?.role === 'admin';
export async function PATCH(req, { params }) {
  if (!(await admin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { phase } = await req.json(), rows = read('bookings'), b = rows.find((r) => r.id === params.id);
  if (!b || !Number.isInteger(phase) || phase < 0 || phase > PHASES.length) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  b.phase = phase; b.status = phase >= PHASES.length ? 'Completed' : PHASES[phase]; write('bookings', rows); return NextResponse.json(b);
}
export async function DELETE(_, { params }) {
  if (!(await admin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  write('bookings', read('bookings').filter((r) => r.id !== params.id)); return NextResponse.json({ ok: true });
}
