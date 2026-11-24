'use client';
import { useState, useMemo, useEffect } from 'react';
import useUser from './useUser';
import Confetti from './Confetti';
import { useToast } from './Toast';
import Link from 'next/link';
import { PACKAGES, ADDONS, CONSULT, ROOMS, calcQuote, money } from '@/lib/pricing';

const STEPS = ['Your Room', 'Design Package', 'Quote', 'Schedule'];
const init = { room: 'living', area: 800, photos: [], pkg: 'signature', addons: {}, rush: false, ctype: 'virtual', name: '', email: '', phone: '', date: '', time: 'morning', notes: '' };

function compress(file) { // shrink to ~480px JPEG so photos stay small
  return new Promise((res) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { const k = Math.min(1, 480 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = img.width * k; c.height = img.height * k; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.6)); };
    img.src = url;
  });
}

export default function BookingWizard() {
  const toast = useToast(), user = useUser(), [s, setS] = useState(init), [step, setStep] = useState(0), [err, setErr] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState(null);
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  useEffect(() => { if (user) setS((p) => ({ ...p, name: user.name, email: user.email })); }, [user]);
  const q = useMemo(() => calcQuote(s), [s]);

  async function addPhotos(files) {
    const imgs = [...files].filter((f) => f.type.startsWith('image/')).slice(0, 4 - s.photos.length);
    const out = await Promise.all(imgs.map(compress)); set('photos', [...s.photos, ...out]);
  }
  async function submit() {
    setErr('');
    if (s.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(s.email)) return setErr('Please enter your name and a valid email.');
    setBusy(true);
    const r = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
    const d = await r.json(); setBusy(false);
    r.ok ? (setDone(d), toast('Booking confirmed! Check your email.')) : setErr(d.error || 'Something went wrong.');
  }

  if (done) return (
    <div className="card p-10 text-center max-w-xl mx-auto pop"><Confetti />
      <div className="w-16 h-16 mx-auto rounded-full bg-clay text-white flex items-center justify-center text-2xl pop">✓</div>
      <h2 className="text-2xl mt-5">You&apos;re booked!</h2>
      <p className="mt-2 text-muted">Reference <b>{done.id}</b> · Estimated quote <b>{money(done.total)}</b>. Track it any time from your dashboard.</p>
      <Link href="/dashboard" className="btn-dark mt-6">View my dashboard</Link>
    </div>);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
      <div className="card p-6 md:p-10">
        <ol className="flex items-center gap-2 mb-8 text-sm">{STEPS.map((t, i) => (
          <li key={t} className={`flex items-center gap-2 ${i < 3 ? 'flex-1' : ''}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold shrink-0 ${i <= step ? 'bg-clay text-white' : 'bg-sand'}`}>{i < step ? '✓' : i + 1}</span>
            <span className={`hidden sm:inline ${i === step ? 'font-semibold' : 'text-muted'}`}>{t}</span>{i < 3 && <span className="flex-1 h-px bg-line" />}
          </li>))}</ol>
        <h2 className="text-2xl mb-6">{STEPS[step]}</h2>

        {step === 0 && <>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className="label">Room type</label><select className="field" value={s.room} onChange={(e) => set('room', e.target.value)}>{Object.entries(ROOMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label className="label">Area: <b>{s.area}</b> sq ft</label><input type="range" min="100" max="4000" step="50" value={s.area} onChange={(e) => set('area', +e.target.value)} className="w-full accent-clay mt-3" /></div>
          </div>
          <label className="label mt-6">Room photos (up to 4)</label>
          <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addPhotos(e.dataTransfer.files); }} className="block border-2 border-dashed border-clay/60 rounded-2xl p-8 text-center cursor-pointer hover:bg-sand transition">
            <p className="font-medium">Drag photos here or click to upload</p><p className="text-xs text-muted mt-1">JPG or PNG</p>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
          </label>
          <div className="flex flex-wrap gap-3 mt-4">{s.photos.map((p, i) => <div key={i} className="relative"><img src={p} alt={`Room ${i + 1}`} className="w-24 h-24 object-cover rounded-xl border border-line" /><button type="button" aria-label="Remove" onClick={() => set('photos', s.photos.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-white text-xs">×</button></div>)}</div>
        </>}

        {step === 1 && <div className="grid md:grid-cols-3 gap-4">{Object.entries(PACKAGES).map(([k, p]) => (
          <button type="button" key={k} onClick={() => set('pkg', k)} className={`text-left p-5 rounded-2xl border-2 transition ${s.pkg === k ? 'border-clay bg-sand' : 'border-line hover:border-clay'}`}>
            <div className="flex justify-between"><h3 className="text-lg">{p.name}</h3>{s.pkg === k && <span className="text-clay">●</span>}</div>
            <p className="text-2xl font-bold text-clay-dark mt-1">${p.rate}<span className="text-xs font-normal text-muted"> / sq ft</span></p>
            <p className="text-sm mt-2 text-muted">{p.blurb}</p><ul className="text-sm mt-3 space-y-1">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul></button>))}</div>}

        {step === 2 && <>
          <div className="grid sm:grid-cols-2 gap-3">{Object.entries(ADDONS).map(([k, [n, c]]) => (
            <label key={k} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-line cursor-pointer hover:border-clay"><span className="flex items-center gap-3"><input type="checkbox" className="accent-clay w-4 h-4" checked={!!s.addons[k]} onChange={(e) => set('addons', { ...s.addons, [k]: e.target.checked })} />{n}</span><b>{money(c)}</b></label>))}
            <label className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-line cursor-pointer hover:border-clay sm:col-span-2"><span className="flex items-center gap-3"><input type="checkbox" className="accent-clay w-4 h-4" checked={s.rush} onChange={(e) => set('rush', e.target.checked)} />Fast-track timeline (about 20% quicker)</span><b>+15%</b></label></div>
          <p className="text-sm text-muted mt-4">Your total updates live. Final pricing is confirmed after consultation.</p></>}

        {step === 3 && <>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className="label">Full name *</label><input className="field" value={s.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Doe" /></div>
            <div><label className="label">Email *</label><input type="email" className="field" value={s.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@example.com" /></div>
            <div><label className="label">Phone</label><input className="field" value={s.phone} onChange={(e) => set('phone', e.target.value)} /></div>
            <div><label className="label">Consultation type</label><select className="field" value={s.ctype} onChange={(e) => set('ctype', e.target.value)}>{Object.entries(CONSULT).map(([k, [n, c]]) => <option key={k} value={k}>{n} ({c ? '$' + c : 'Free'})</option>)}</select></div>
            <div><label className="label">Preferred date</label><input type="date" className="field" min={new Date().toISOString().slice(0, 10)} value={s.date} onChange={(e) => set('date', e.target.value)} /></div>
            <div><label className="label">Preferred time</label><select className="field" value={s.time} onChange={(e) => set('time', e.target.value)}><option value="morning">Morning (9am–12pm)</option><option value="afternoon">Afternoon (12pm–4pm)</option><option value="evening">Evening (4pm–7pm)</option></select></div>
          </div>
          <label className="label mt-5">Notes</label><textarea rows={3} className="field" value={s.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Style, budget, inspirations…" />
          {user === null && <p className="text-sm mt-4 p-3 rounded-xl bg-sand">Please <Link href="/login" className="text-clay-dark font-semibold">log in</Link> or <Link href="/signup" className="text-clay-dark font-semibold">sign up</Link> to confirm your booking. Your selections are kept.</p>}
          {err && <p role="alert" className="text-sm text-red-600 mt-3">{err}</p>}</>}

        <div className="flex justify-between mt-8">
          {step ? <button type="button" className="btn-line" onClick={() => setStep(step - 1)}>Back</button> : <span />}
          <button type="button" className="btn-dark" disabled={busy || (step === 3 && !user)} onClick={() => (step === 3 ? submit() : setStep(step + 1))}>{step === 3 ? (busy ? 'Booking…' : 'Book Consultation') : 'Continue'}</button>
        </div>
      </div>

      <aside className="card p-6 lg:sticky lg:top-28">
        <p className="text-xs uppercase tracking-widest text-muted">Estimated quote</p>
        <p className="text-4xl font-display font-bold mt-1">{money(q.total)}</p>
        <div className="mt-4 space-y-2 text-sm">
          <Row l={`${q.pkgName} · ${q.area} sq ft`} v={money(q.base)} />
          {q.items.map((i) => <Row key={i.label} l={i.label} v={money(i.amount)} />)}
          {q.rushFee > 0 && <Row l="Fast-track" v={money(q.rushFee)} />}
          {q.credit > 0 && <Row l="Consultation credit" v={'-' + money(q.credit)} cls="text-clay-dark" />}
        </div>
        <div className="border-t border-line mt-4 pt-4 text-sm flex justify-between"><span>Estimated duration</span><b>{q.weeks.reduce((a, b) => a + b, 0)} weeks</b></div>
      </aside>
    </div>);
}
const Row = ({ l, v, cls = '' }) => <div className={`flex justify-between ${cls}`}><span>{l}</span><b>{v}</b></div>;
