'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useUser from './useUser';
import { useToast } from './Toast';
export default function Navbar() {
  const toast = useToast(), path = usePathname(), router = useRouter(), user = useUser(), [open, setOpen] = useState(false);
  const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/portfolio', 'Portfolio'], ['/consultation', 'Consultation'], ['/studio', 'Studio'], ['/quiz', 'Style Quiz'], ['/contact', 'Contact'], ...(user ? [[user.role === 'admin' ? '/admin' : '/dashboard', user.role === 'admin' ? 'Admin' : 'Dashboard']] : [])];
  const [dark, setDark] = useState(false), [rtl, setRtl] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains('dark')); setRtl(document.documentElement.dir === 'rtl'); }, []);
  const toggleDark = () => { const v = !dark; setDark(v); document.documentElement.classList.toggle('dark', v); localStorage.setItem('theme', v ? 'dark' : 'light'); };
  const toggleRtl = () => { const v = !rtl; setRtl(v); document.documentElement.dir = v ? 'rtl' : 'ltr'; localStorage.setItem('dir', v ? 'rtl' : 'ltr'); };
  const tools = <div className="flex gap-2"><button onClick={toggleDark} aria-label="Toggle dark mode" className="w-10 h-10 rounded-full bg-sand hover:scale-110 transition">{dark ? '☀' : '☾'}</button><button onClick={toggleRtl} aria-label="Toggle right-to-left layout" className="w-10 h-10 rounded-full bg-sand hover:scale-110 transition text-xs font-bold">{rtl ? 'LTR' : 'RTL'}</button></div>;
  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); setOpen(false); toast('You have been logged out'); router.push('/'); router.refresh(); }
  const auth = user ? <button onClick={logout} className="btn-line !py-2 !px-5 text-sm">Log out</button> : <div className="flex gap-2"><Link href="/login" className="btn-line !py-2 !px-5 text-sm">Log in</Link><Link href="/signup" className="btn-dark !py-2 !px-5 text-sm">Sign up</Link></div>;
  return (
    <header className="print:hidden fixed inset-x-0 top-0 z-50 bg-surface/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">AURA<span className="text-clay">SPACE</span></Link>
        <nav className="hidden xl:flex gap-5 text-sm font-medium">{links.map(([h, t]) => <Link key={h} href={h} className={path === h ? 'text-clay-dark' : 'hover:text-clay-dark'}>{t}</Link>)}</nav>
        <div className="hidden xl:flex items-center gap-3">{tools}{user && <span className="text-sm text-muted">Hi, {user.name.split(' ')[0]}</span>}{user !== undefined && auth}</div>
        <button className="xl:hidden text-2xl" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
      </div>
      {open && <nav className="xl:hidden border-t border-line bg-surface px-6 py-3 flex flex-col">{links.map(([h, t]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3 font-medium">{t}</Link>)}<div className="py-3 flex items-center gap-3">{tools}{user !== undefined && auth}</div></nav>}
    </header>
  );
}
