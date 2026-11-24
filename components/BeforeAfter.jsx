'use client';
import { useState } from 'react';
export default function BeforeAfter({ src, alt }) {
  const [p, setP] = useState(50);
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl select-none aspect-[16/10]">
      <img src={src} alt={`${alt} after design`} className="absolute inset-0 w-full h-full object-cover" />
      <img src={src} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(1) brightness(.65) contrast(.85) blur(1px)', clipPath: `inset(0 ${100 - p}% 0 0)` }} />
      <span className="absolute top-4 left-4 glass text-white text-xs font-semibold px-3 py-1 rounded-full">BEFORE</span><span className="absolute top-4 right-4 bg-clay text-white text-xs font-semibold px-3 py-1 rounded-full">AFTER</span>
      <div className="absolute inset-y-0 w-0.5 bg-white pointer-events-none" style={{ left: p + '%' }}><span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-ink shadow-lg flex items-center justify-center text-sm">⇄</span></div>
      <input type="range" min="0" max="100" value={p} onChange={(e) => setP(+e.target.value)} aria-label="Before and after slider" className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
    </div>);
}
