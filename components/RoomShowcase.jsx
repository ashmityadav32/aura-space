'use client';
import { useState } from 'react';
import Link from 'next/link';
import Room3D from './Room3D';
import { PALETTES } from '@/lib/palettes';
export default function RoomShowcase({ full = false }) {
  const [i, setI] = useState(0), [c, setC] = useState({}), p = { ...PALETTES[i], ...c };
  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-center">
      <Room3D wall={p.wall} floor={p.floor} sofa={p.sofa} accent={p.accent} />
      <div><h3 className="text-2xl">Pick a palette</h3><p className="text-sm text-muted mt-1">Selected: <b>{p.name}</b></p>
        <div className="grid grid-cols-3 gap-3 mt-4">{PALETTES.map((x, k) => <button key={x.name} onClick={() => { setI(k); setC({}); }} aria-label={x.name} title={x.name} className={`rounded-2xl p-2 border-2 transition hover:-translate-y-0.5 ${i === k ? 'border-clay' : 'border-line'}`}><span className="flex h-8 rounded-lg overflow-hidden">{[x.wall, x.floor, x.sofa, x.accent].map((col) => <span key={col} className="flex-1" style={{ background: col }} />)}</span></button>)}</div>
        {full ? <div className="grid grid-cols-2 gap-3 mt-5">{[['wall', 'Walls'], ['floor', 'Floor'], ['sofa', 'Sofa'], ['accent', 'Accent']].map(([k, l]) => <label key={k} className="flex items-center justify-between text-sm card !rounded-2xl px-3 py-2">{l}<input type="color" value={p[k]} onChange={(e) => setC({ ...c, [k]: e.target.value })} className="w-8 h-8 rounded cursor-pointer bg-transparent" /></label>)}</div>
          : <Link href="/studio" className="btn-line mt-6">Open Design Studio</Link>}
        {full && <Link href="/consultation" className="btn-dark mt-6">Book with this palette</Link>}
      </div>
    </div>);
}
