import { NextResponse } from 'next/server';
import { read, write } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendMail } from '@/lib/mail';
import { calcQuote, PACKAGES, ROOMS, CONSULT } from '@/lib/pricing';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const s = await getSession(); if (!s) return NextResponse.json({ error: 'Please log in to book a consultation.' }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !PACKAGES[b.pkg] || !ROOMS[b.room] || !CONSULT[b.ctype]) return NextResponse.json({ error: 'Invalid selection' }, { status: 422 });
  const q = calcQuote(b), rows = read('bookings');
  const booking = {
    id: 'AS-' + Math.random().toString(36).slice(2, 7).toUpperCase(), userId: s.id, createdAt: new Date().toISOString(),
    status: 'Consultation Scheduled', phase: 0, name: s.name, email: s.email, phone: String(b.phone || '').slice(0, 30),
    room: b.room, area: q.area, pkg: b.pkg, addons: b.addons || {}, rush: !!b.rush, ctype: b.ctype,
    date: b.date || '', time: b.time || '', notes: String(b.notes || '').slice(0, 1000),
    photos: (b.photos || []).slice(0, 4).filter((p) => typeof p === 'string' && p.startsWith('data:image/')),
    total: q.total, weeks: q.weeks,
  };
  write('bookings', [...rows, booking]);
  sendMail({ to: s.email, subject: `Booking confirmed: ${booking.id}`, text: `Hi ${s.name},\n\nThanks for booking with Aura Space.\nReference: ${booking.id}\nPackage: ${PACKAGES[b.pkg].name}\nEstimated quote: $${Math.round(q.total)}\n\nTrack your project from your dashboard. We will confirm your slot within 24 hours.` }).catch(() => {});
  return NextResponse.json({ id: booking.id, total: booking.total }, { status: 201 });
}
// Clients see only their own bookings; admins see all.
export async function GET() {
  const s = await getSession(); if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = read('bookings'); return NextResponse.json((s.role === 'admin' ? rows : rows.filter((r) => r.userId === s.id)).reverse());
}
