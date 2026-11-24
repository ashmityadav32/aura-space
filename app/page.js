import Link from 'next/link';
import { PACKAGES, money } from '@/lib/pricing';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import FAQ from '@/components/FAQ';
import TypedWords from '@/components/TypedWords';
import BeforeAfter from '@/components/BeforeAfter';
import QuoteTeaser from '@/components/QuoteTeaser';
import Tilt from '@/components/Tilt';
import ParallaxImg from '@/components/ParallaxImg';
import RoomShowcase from '@/components/RoomShowcase';
const steps = [['1', 'Upload your room', 'Share photos and dimensions.'], ['2', 'Pick a package', 'Essential, Signature or Luxury.'], ['3', 'Get an instant quote', 'Transparent, itemised pricing.'], ['4', 'Track your project', 'Timeline and dashboard.']];
const stats = [[120, '+', 'Projects delivered'], [98, '%', 'Client satisfaction'], [12, '', 'Years of experience'], [35, '+', 'Design awards']];
const reviews = [['Priya S.', 'Living room makeover', 'The instant quote removed all the guesswork, and the timeline kept me informed at every step.'], ['Daniel R.', 'Full-home design', 'Uploading photos before the call meant our consultation was focused and productive.'], ['Meera K.', 'Kitchen renovation', 'Professional, transparent and beautifully executed. Highly recommended.']];
export default function Home() {
  return (<>
    <section className="relative h-[640px] flex items-center text-center text-white">
      <div className="absolute inset-0 overflow-hidden"><ParallaxImg src="/images/hero_bg_index.jpg" /></div><div className="absolute inset-0 bg-black/60" /><div aria-hidden className="float absolute -top-10 -left-16 w-80 h-80 rounded-full bg-clay/30 blur-3xl" /><div aria-hidden className="float-slow absolute bottom-0 right-0 w-96 h-96 rounded-full bg-clay-dark/30 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-6"><span className="glass px-5 py-1.5 rounded-full text-sm font-semibold">✦ Interior Design Consultation Portal</span>
        <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">Design your dream <br /><TypedWords words={['living room', 'bedroom', 'kitchen', 'home']} /></h1>
        <p className="mt-5 text-lg">Book a consultation, get an instant quote and follow every milestone of your project.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4"><Link href="/consultation" className="btn bg-surface text-ink hover:bg-sand hover:-translate-y-0.5">Book Consultation</Link><Link href="/dashboard" className="btn border-2 border-white hover:bg-surface hover:text-ink">Track My Project</Link></div></div>
    </section>
    <section className="bg-ink text-cream"><div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">{stats.map(([n, s, l]) => <div key={l}><p className="font-display text-4xl font-bold text-clay"><CountUp to={n} suffix={s} /></p><p className="text-sm mt-1 text-cream/70">{l}</p></div>)}</div></section>
    <div className="overflow-hidden bg-sand py-4 border-y border-line" aria-hidden><div className="marquee">{[...Array(2)].map((_, k) => <div key={k} className="flex shrink-0 gap-12 pr-12 font-display text-lg text-muted">{['Living Rooms', 'Bedrooms', 'Kitchens', 'Bathrooms', 'Home Offices', 'Full Homes', 'Lighting Design', 'Colour Palettes'].map((x) => <span key={x}>{x} <span className="text-clay">✦</span></span>)}</div>)}</div></div>
    <section className="mx-auto max-w-6xl px-6 py-20 grid lg:grid-cols-2 gap-12 items-center"><Reveal><span className="text-sm font-semibold text-clay-dark">TRANSFORMATIONS</span><h2 className="text-3xl md:text-4xl font-bold mt-2">See the difference good design makes</h2><p className="text-muted mt-4">Drag the slider to compare a space before and after our design process.</p></Reveal><Reveal delay={150}><BeforeAfter src="/images/portfolio5.jpg" alt="Open plan living" /></Reveal></section>
    <section className="mx-auto max-w-6xl px-6 py-20"><Reveal><div className="text-center mb-10"><span className="text-sm font-semibold text-clay-dark">3D PREVIEW</span><h2 className="text-3xl md:text-4xl font-bold mt-2">Walk around your future room</h2><p className="text-muted mt-3">Drag to rotate, then try different colour palettes.</p></div><RoomShowcase /></Reveal></section>
    <section className="bg-sand py-20"><div className="mx-auto max-w-5xl px-6"><Reveal><QuoteTeaser /></Reveal></div></section>
    <section className="mx-auto max-w-6xl px-6 py-20"><Reveal><h2 className="text-3xl md:text-4xl font-bold text-center">How it works</h2></Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">{steps.map(([n, t, d], i) => <Reveal key={n} delay={i * 120}><div className="card p-7 text-center h-full hover:-translate-y-1 hover:shadow-lg transition"><div className="w-12 h-12 mx-auto rounded-full bg-clay text-white flex items-center justify-center font-bold">{n}</div><h3 className="mt-4 text-lg">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></div></Reveal>)}</div></section>
    <section className="bg-sand py-20"><div className="mx-auto max-w-6xl px-6"><Reveal><h2 className="text-3xl md:text-4xl font-bold text-center">Design packages</h2></Reveal>
      <div className="grid md:grid-cols-3 gap-6 mt-12">{Object.entries(PACKAGES).map(([k, p], i) => <Reveal key={k} delay={i * 120}><Tilt className="h-full"><div className={`card p-8 h-full hover:-translate-y-1 hover:shadow-lg transition ${k === 'signature' ? 'border-2 border-clay' : ''}`}>{k === 'signature' && <span className="text-xs bg-clay text-white px-3 py-1 rounded-full">Most popular</span>}<h3 className="text-xl mt-2">{p.name}</h3><p className="text-3xl font-bold text-clay-dark mt-2">{money(p.rate)}<span className="text-sm font-normal text-muted"> / sq ft</span></p><p className="text-sm text-muted mt-3">{p.blurb}</p><ul className="mt-4 space-y-1 text-sm">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul><Link href="/consultation" className="btn-line w-full mt-6">Choose {p.name}</Link></div></Tilt></Reveal>)}</div></div></section>
    <section className="mx-auto max-w-6xl px-6 py-20"><Reveal><h2 className="text-3xl md:text-4xl font-bold text-center">What clients say</h2></Reveal>
      <div className="grid md:grid-cols-3 gap-6 mt-12">{reviews.map(([n, p, t], i) => <Reveal key={n} delay={i * 120}><figure className="card p-7 h-full border-l-4 border-l-clay"><p className="text-clay tracking-widest">★★★★★</p><blockquote className="mt-3 text-sm text-muted">“{t}”</blockquote><figcaption className="mt-5 flex items-center gap-3"><span className="w-10 h-10 rounded-full bg-clay text-white flex items-center justify-center font-semibold">{n[0]}</span><span className="text-sm"><b>{n}</b><br /><span className="text-muted">{p}</span></span></figcaption></figure></Reveal>)}</div></section>
    <section className="bg-sand py-20"><div className="mx-auto max-w-3xl px-6"><Reveal><h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently asked questions</h2><FAQ /></Reveal></div></section>
    <section className="mx-auto max-w-4xl px-6 py-20 text-center"><Reveal><h2 className="text-3xl md:text-4xl font-bold">Ready to start your project?</h2><p className="text-muted mt-3">Get your instant quote in under two minutes.</p><Link href="/consultation" className="btn-dark mt-8">Book Consultation</Link></Reveal></section>
  </>);
}
