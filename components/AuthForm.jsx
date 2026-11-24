'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function AuthForm({ mode }) {
  const signup = mode === 'signup', router = useRouter(), [f, setF] = useState({ name: '', email: '', password: '' }), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    const r = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }), d = await r.json(); setBusy(false);
    if (!r.ok) return setErr(d.error);
    router.push(d.role === 'admin' ? '/admin' : '/dashboard'); router.refresh();
  }
  return (
    <div className="mx-auto max-w-md px-6 py-16"><form onSubmit={go} className="card p-8">
      <h1 className="text-3xl">{signup ? 'Create your account' : 'Welcome back'}</h1>
      <p className="text-muted text-sm mt-2">{signup ? 'Book consultations and track your projects.' : 'Log in to your dashboard.'}</p>
      {signup && <><label className="label mt-6">Full name</label><input className="field" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></>}
      <label className="label mt-4">Email</label><input type="email" className="field" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <label className="label mt-4">Password</label><input type="password" className="field" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      {!signup && <p className="text-right mt-2"><Link href="/forgot-password" className="text-sm text-clay-dark">Forgot password?</Link></p>}
      {err && <p role="alert" className="text-sm text-red-600 mt-3">{err}</p>}
      <button className="btn-dark w-full mt-6" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Sign up' : 'Log in'}</button>
      <p className="text-sm text-muted text-center mt-5">{signup ? <>Already registered? <Link className="text-clay-dark font-medium" href="/login">Log in</Link></> : <>New here? <Link className="text-clay-dark font-medium" href="/signup">Create an account</Link></>}</p>
    </form></div>);
}
