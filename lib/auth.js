import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { read, write } from './db';
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me-in-env-file-32chars');
export function getUsers() { // seeds the admin account on first use
  let u = read('users');
  if (!u.length) { u = [{ id: 'u_admin', name: 'Admin', email: 'admin@aura.com', role: 'admin', hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10) }]; write('users', u); }
  return u;
}
export const hash = (p) => bcrypt.hashSync(p, 10);
export const verify = (p, h) => bcrypt.compareSync(p, h);
export async function startSession(u) {
  const t = await new SignJWT({ id: u.id, name: u.name, email: u.email, role: u.role }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret());
  cookies().set('aura_session', t, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession() {
  const t = cookies().get('aura_session')?.value; if (!t) return null;
  try { return (await jwtVerify(t, secret())).payload; } catch { return null; }
}
