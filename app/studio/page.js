'use client';
import { useState } from 'react';
import PageHero from '@/components/PageHero';
import RoomShowcase from '@/components/RoomShowcase';
import Planner from '@/components/Planner';
export default function Studio() {
  const [tab, setTab] = useState('palette');
  return (<><PageHero title="Design Studio" sub="Try colours in 3D and plan your layout before you book." />
    <section className="mx-auto max-w-6xl px-6 py-12"><div className="flex gap-2 mb-8">{[['palette', 'Palette & 3D preview'], ['planner', 'Room planner']].map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition ${tab === k ? 'bg-ink text-cream border-ink' : 'border-line hover:border-clay'}`}>{l}</button>)}</div>
      {tab === 'palette' ? <RoomShowcase full /> : <Planner />}</section></>);
}
