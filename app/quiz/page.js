'use client';
import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Room3D from '@/components/Room3D';
import { PALETTES } from '@/lib/palettes';
import { PACKAGES } from '@/lib/pricing';
const Q = [
  ['What mood do you want at home?', [['Calm and airy', { minimal: 2, modern: 1 }], ['Bold and colourful', { boho: 2 }], ['Elegant and timeless', { classic: 2 }], ['Sleek and urban', { modern: 2 }]]],
  ['Pick your favourite materials', [['Light wood and linen', { minimal: 2 }], ['Velvet and brass', { classic: 2 }], ['Concrete and glass', { modern: 2 }], ['Rattan and plants', { boho: 2 }]]],
  ['Choose a colour story', [['Whites and neutrals', { minimal: 2 }], ['Deep jewel tones', { classic: 2 }], ['Black and grey', { modern: 2 }], ['Warm terracotta', { boho: 2 }]]],
  ['What matters most?', [['Storage and function', { modern: 1, minimal: 1 }], ['Statement pieces', { classic: 1, boho: 1 }], ['Cosy comfort', { boho: 1, classic: 1 }], ['Clean, uncluttered space', { minimal: 2 }]]],
  ['What is your budget?', [['Under $5k', { $: 0 }], ['$5k to $15k', { $: 1 }], ['$15k to $30k', { $: 2 }], ['$30k and above', { $: 3 }]]],
];
const STYLES = { minimal: [0, 'Nordic Minimal', 'Light, calm and clutter-free, with natural textures.'], modern: [1, 'Modern Urban', 'Sleek lines, bold contrast and smart use of space.'], classic: [2, 'Timeless Classic', 'Rich colours, refined finishes and elegant detail.'], boho: [3, 'Earthy Boho', 'Warm, layered and full of character and greenery.'] };
export default function Quiz() {
  const [step, setStep] = useState(0), [score, setScore] = useState({});
  const pick = (s) => { const n = { ...score }; Object.entries(s).forEach(([k, v]) => (n[k] = (n[k] || 0) + v)); setScore(n); setStep(step + 1); };
  const done = step >= Q.length, style = Object.keys(STYLES).sort((a, b) => (score[b] || 0) - (score[a] || 0))[0], pkg = ['essential', 'signature', 'signature', 'luxury'][score.$ || 0], p = PALETTES[STYLES[style][0]];
  return (<><PageHero title="Style Quiz" sub="Five quick questions to find your style and the right package." />
    <section className="mx-auto max-w-3xl px-6 py-14">{!done ? (<div key={step} className="card p-8 md:p-10 page-in">
      <div className="h-2 bg-sand rounded-full overflow-hidden mb-6"><div className="h-full bg-clay transition-all duration-500" style={{ width: (step / Q.length) * 100 + '%' }} /></div>
      <p className="text-sm text-muted">Question {step + 1} of {Q.length}</p><h2 className="text-2xl mt-1">{Q[step][0]}</h2>
      <div className="grid sm:grid-cols-2 gap-3 mt-6">{Q[step][1].map(([l, s]) => <button key={l} onClick={() => pick(s)} className="text-left p-5 rounded-2xl border-2 border-line hover:border-clay hover:bg-sand hover:-translate-y-0.5 transition font-medium">{l}</button>)}</div>
      {step > 0 && <button onClick={() => { setStep(0); setScore({}); }} className="text-sm text-muted mt-6 underline">Start over</button>}</div>) : (
      <div className="card p-8 md:p-10 text-center pop"><p className="text-sm text-clay-dark font-semibold">YOUR STYLE</p><h2 className="text-4xl mt-1">{STYLES[style][1]}</h2><p className="text-muted mt-2">{STYLES[style][2]}</p>
        <div className="mt-6"><Room3D wall={p.wall} floor={p.floor} sofa={p.sofa} accent={p.accent} /></div>
        <p className="mt-6">We recommend the <b>{PACKAGES[pkg].name}</b> package: {PACKAGES[pkg].blurb}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6"><Link href="/consultation" className="btn-dark">Book consultation</Link><Link href="/studio" className="btn-line">Explore in Studio</Link><button onClick={() => { setStep(0); setScore({}); }} className="btn-line">Retake quiz</button></div></div>)}</section></>);
}
