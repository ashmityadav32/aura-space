import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUsers } from '@/lib/auth';
import { read, write } from '@/lib/db';
import { sendMail } from '@/lib/mail';
export async function POST(req) {
  const b = await req.json().catch(() => ({})), u = getUsers().find((x) => x.email === String(b.email || '').trim().toLowerCase()), out = { ok: true };
  if (u) { // same response either way, so emails can't be enumerated
    const token = crypto.randomBytes(24).toString('hex'), id = crypto.createHash('sha256').update(token).digest('hex');
    write('resets', [...read('resets').filter((r) => r.exp > Date.now()), { id, userId: u.id, exp: Date.now() + 3600000 }]);
    const link = `${new URL(req.url).origin}/reset-password?token=${token}`;
    await sendMail({ to: u.email, subject: 'Reset your Aura Space password', text: `Hi ${u.name},\n\nReset your password (valid for 1 hour):\n${link}\n\nIgnore this email if you did not ask for it.` }).catch(() => {});
    if (!process.env.SMTP_HOST && process.env.NODE_ENV !== 'production') out.devLink = link;
  }
  return NextResponse.json(out);
}
