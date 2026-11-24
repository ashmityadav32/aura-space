'use client';
import { useEffect, useState } from 'react';
export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => { const f = () => { const h = document.documentElement.scrollHeight - innerHeight; setP(h > 0 ? scrollY / h : 0); }; f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f); }, []);
  return (<div className="print:hidden"><div className="fixed top-0 left-0 z-[70] h-1 bg-clay" style={{ width: p * 100 + '%' }} />
    <button aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-ink text-cream shadow-lg transition-all ${p > 0.12 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>↑</button></div>);
}
