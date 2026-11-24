'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PACKAGES, calcQuote, money } from '@/lib/pricing';
export default function QuoteTeaser() {
  const [area, setArea] = useState(900), [pkg, setPkg] = useState('signature'), q = calcQuote({ pkg, area, ctype: 'discovery' });
  return (
    <div className="card p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
      <div><h3 className="text-2xl">Try the instant quote</h3><p className="text-sm text-muted mt-2">Drag the slider and pick a package. See your estimate update live.</p>
        <label className="label mt-6">Room size: <b>{area}</b> sq ft</label><input type="range" min="100" max="4000" step="50" value={area} onChange={(e) => setArea(+e.target.value)} className="w-full accent-clay" />
        <div className="flex gap-2 mt-5 flex-wrap">{Object.entries(PACKAGES).map(([k, p]) => <button key={k} onClick={() => setPkg(k)} className={`px-5 py-2 rounded-full text-sm font-medium border transition ${pkg === k ? 'bg-ink text-cream border-ink' : 'border-line hover:border-clay'}`}>{p.name}</button>)}</div></div>
      <div className="text-center rounded-3xl bg-sand p-8"><p className="text-xs uppercase tracking-widest text-muted">Estimated project cost</p><p key={q.total} className="pop font-display text-5xl font-bold text-clay-dark mt-2">{money(q.total)}</p>
        <p className="text-sm text-muted mt-2">about {q.weeks.reduce((a, b) => a + b, 0)} weeks to completion</p><Link href="/consultation" className="btn-dark mt-6">Book with this estimate</Link></div>
    </div>);
}
