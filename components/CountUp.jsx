'use client';
import { useEffect, useRef, useState } from 'react';
export default function CountUp({ to, suffix = '', format }) {
  const ref = useRef(null), [n, setN] = useState(0);
  useEffect(() => { const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); const t0 = performance.now(), tick = (t) => { const p = Math.min((t - t0) / 1500, 1); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }); io.observe(ref.current); return () => io.disconnect(); }, [to]);
  return <span ref={ref}>{format ? format(n) : n + suffix}</span>;
}
