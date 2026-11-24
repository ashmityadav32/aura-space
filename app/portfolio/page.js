'use client';
import { useState, useEffect } from 'react';
import PageHero from '@/components/PageHero';
const works = [['Skyline Loft', 'Living', 'portfolio1.jpg'], ['Quiet Retreat', 'Bedroom', 'portfolio2.jpg'], ['Heritage Kitchen', 'Kitchen', 'portfolio3.jpg'], ['Calm Spa Bath', 'Bathroom', 'portfolio4.jpg'], ['Open Plan Living', 'Living', 'portfolio5.jpg'], ['Master Suite', 'Bedroom', 'portfolio6.jpg']];
export default function Portfolio() {
  const [f, setF] = useState('All'), [sel, setSel] = useState(null), cats = ['All', ...new Set(works.map((w) => w[1]))], list = works.filter((w) => f === 'All' || w[1] === f);
  useEffect(() => { if (sel === null) return; const k = (e) => { if (e.key === 'Escape') setSel(null); if (e.key === 'ArrowRight') setSel((s) => (s + 1) % list.length); if (e.key === 'ArrowLeft') setSel((s) => (s - 1 + list.length) % list.length); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [sel, list.length]);
  const cur = list[sel];
  return (<><PageHero title="Portfolio" sub="Click any project to view it full-size." />
    <section className="mx-auto max-w-6xl px-6 py-14"><div className="flex flex-wrap justify-center gap-2 mb-10">{cats.map((c) => <button key={c} onClick={() => setF(c)} className={`px-5 py-2 rounded-full text-sm font-medium border transition ${f === c ? 'bg-ink text-cream border-ink' : 'border-line hover:border-clay'}`}>{c}</button>)}</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{list.map(([t, c, i], k) => <button key={t} onClick={() => setSel(k)} className="relative overflow-hidden rounded-3xl group text-left shadow-sm hover:shadow-2xl transition-shadow aspect-[4/3]"><img src={`/images/${i}`} alt={t} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition" /><span className="absolute bottom-0 p-5 text-white translate-y-2 group-hover:translate-y-0 transition"><span className="block font-display text-xl">{t}</span><span className="text-sm text-white/80">{c} · View project →</span></span></button>)}</div></section>
    {cur && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[90] bg-black/85 flex items-center justify-center p-4 page-in" onClick={() => setSel(null)}>
      <button aria-label="Close" className="absolute top-5 right-6 text-white text-4xl" onClick={() => setSel(null)}>×</button>
      <button aria-label="Previous" className="absolute left-3 md:left-8 text-white text-5xl" onClick={(e) => { e.stopPropagation(); setSel((sel - 1 + list.length) % list.length); }}>‹</button>
      <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}><img src={`/images/${cur[2]}`} alt={cur[0]} className="w-full max-h-[78vh] object-contain rounded-2xl" /><figcaption className="text-white text-center mt-4 font-display text-xl">{cur[0]} <span className="text-white/60 text-base font-body">· {cur[1]}</span></figcaption></figure>
      <button aria-label="Next" className="absolute right-3 md:right-8 text-white text-5xl" onClick={(e) => { e.stopPropagation(); setSel((sel + 1) % list.length); }}>›</button></div>}</>);
}
