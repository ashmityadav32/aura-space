'use client';
import { useEffect, useRef, useState } from 'react';
import { useToast } from './Toast';
export default function Chat({ bookingId, me }) {
  const [msgs, setMsgs] = useState(null), [text, setText] = useState(''), box = useRef(), toast = useToast();
  const load = async () => { const r = await fetch(`/api/chat?booking=${bookingId}`, { cache: 'no-store' }); if (r.ok) setMsgs(await r.json()); };
  useEffect(() => { setMsgs(null); load(); const t = setInterval(load, 4000); return () => clearInterval(t); }, [bookingId]);
  useEffect(() => { box.current?.scrollTo(0, 1e9); }, [msgs?.length]);
  async function send(e) { e.preventDefault(); if (!text.trim()) return; const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId, text }) }); if (r.ok) { setText(''); load(); } else toast('Could not send message', 'err'); }
  return (<div><div ref={box} className="h-64 overflow-y-auto space-y-2 p-3 rounded-2xl bg-sand">{msgs === null ? <p className="text-sm text-muted">Loading…</p> : msgs.length === 0 ? <p className="text-sm text-muted text-center mt-20">No messages yet. Say hello!</p> : msgs.map((m) => <div key={m.id} className={`flex ${m.from === me ? 'justify-end' : ''}`}><div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.from === me ? 'bg-ink text-cream' : 'bg-surface border border-line'}`}><p className="text-[10px] opacity-60">{m.from === me ? 'You' : m.name} · {new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>{m.text}</div></div>)}</div>
    <form onSubmit={send} className="flex gap-2 mt-3"><input className="field" placeholder="Type a message…" value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} aria-label="Message" /><button className="btn-dark !px-5">Send</button></form></div>);
}
