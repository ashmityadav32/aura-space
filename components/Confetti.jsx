'use client';
import { useState } from 'react';
export default function Confetti() {
  const [bits] = useState(() => Array.from({ length: 60 }, (_, i) => ({ i, l: Math.random() * 100, d: Math.random() * 1.2, t: 2.5 + Math.random() * 2, c: ['#C89B8B', '#F2E3DB', '#A65A48', '#1E1A17', '#E8C8B8'][i % 5], s: 6 + Math.random() * 8 })));
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">{bits.map((b) => <span key={b.i} className="absolute top-0 rounded-sm" style={{ left: b.l + '%', width: b.s, height: b.s * 1.6, background: b.c, animation: `fall ${b.t}s ${b.d}s ease-in forwards`, opacity: 0 }} />)}</div>;
}
