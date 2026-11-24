'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
export function Forgot() {
  const [email, setEmail] = useState(''), [res, setRes] = useState(null);
  async function go(e) { e.preventDefault(); const r = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); setRes(await r.json()); }
  return (<div className="mx-auto max-w-md px-6 py-16"><form onSubmit={go} className="card p-8"><h1 className="text-3xl">Forgot password?</h1><p className="text-sm text-muted mt-2">We&apos;ll email you a reset link.</p>
    <label className="label mt-6">Email</label><input type="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
    {res && <div role="status" className="mt-4 text-sm p-3 rounded-xl bg-sand">If that email is registered, a reset link has been sent.{res.devLink && <> <b>Demo mode:</b> <a className="text-clay-dark underline break-all" href={res.devLink}>open reset link</a></>}</div>}
    <button className="btn-dark w-full mt-6">Send reset link</button><p className="text-sm text-center mt-5"><Link href="/login" className="text-clay-dark font-medium">Back to log in</Link></p></form></div>);
}
export function Reset() {
  const token = useSearchParams().get('token') || '', [pw, setPw] = useState(''), [msg, setMsg] = useState(null);
  async function go(e) { e.preventDefault(); const r = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password: pw }) }), d = await r.json(); setMsg(r.ok ? { ok: 1 } : { t: d.error }); }
  return (<div className="mx-auto max-w-md px-6 py-16"><form onSubmit={go} className="card p-8"><h1 className="text-3xl">Set a new password</h1>
    {msg?.ok ? <p className="mt-5 text-green-700">Password updated. <Link href="/login" className="text-clay-dark font-semibold">Log in</Link></p> : <><label className="label mt-6">New password</label><input type="password" minLength={6} required className="field" value={pw} onChange={(e) => setPw(e.target.value)} />{msg && <p role="alert" className="text-sm text-red-600 mt-3">{msg.t}</p>}<button className="btn-dark w-full mt-6">Update password</button></>}</form></div>);
}
