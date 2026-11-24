'use client';
import { useState } from 'react';
import PageHero from '@/components/PageHero';
import { useToast } from '@/components/Toast';
export default function Contact() {
  const toast = useToast(), [f, setF] = useState({ name: '', email: '', message: '' }), [msg, setMsg] = useState(null);
  async function send(e) { e.preventDefault(); const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }), d = await r.json(); r.ok ? (toast('Message sent. We will reply within 24 hours.'), setMsg({ ok: 1, t: 'Thanks! We will reply within 24 hours.' }), setF({ name: '', email: '', message: '' })) : setMsg({ t: d.error }); }
  return (<><PageHero title="Contact Us" sub="Questions before you book? Send us a message." />
    <section className="mx-auto max-w-2xl px-6 py-14"><form onSubmit={send} className="card p-8 space-y-4">
      <div><label className="label">Name</label><input className="field" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div><label className="label">Email</label><input type="email" className="field" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div><label className="label">Message</label><textarea rows={5} className="field" required value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
      {msg && <p role="alert" className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.t}</p>}<button className="btn-dark w-full">Send message</button></form></section></>);
}
