'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PACKAGES, ROOMS, PHASES, CONSULT, calcQuote, money } from '@/lib/pricing';
import Timeline from '@/components/Timeline';
import Ring from '@/components/Ring';
import Chat from '@/components/Chat';
import { PageSkeleton } from '@/components/Skeleton';
import useUser from '@/components/useUser';

export default function Dashboard() {
  const user = useUser(), router = useRouter(), [rows, setRows] = useState(null), [sel, setSel] = useState(0);
  useEffect(() => { if (user === null) router.push('/login'); if (user) fetch('/api/bookings', { cache: 'no-store' }).then((r) => r.json()).then(setRows); }, [user]);
  if (!rows) return <PageSkeleton />;
  if (!rows.length) return <div className="text-center py-28 px-6"><h1 className="text-3xl">Welcome, {user.name.split(' ')[0]}</h1><p className="text-muted mt-3">You have no projects yet.</p><Link href="/consultation" className="btn-dark mt-6">Book your first consultation</Link></div>;
  const b = rows[sel], q = calcQuote(b), pct = Math.round((b.phase / PHASES.length) * 100);
  const stats = [['Status', b.status], ['Progress', pct + '%'], ['Milestones', `${b.phase}/${PHASES.length}`], ['Quote', money(b.total)]];
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden"><div><p className="text-sm text-muted">Hello, {user.name}</p><h1 className="text-3xl">My Projects</h1></div>
        <select className="field !w-auto" value={sel} onChange={(e) => setSel(+e.target.value)}>{rows.map((r, i) => <option key={r.id} value={i}>{r.id} · {ROOMS[r.room]}</option>)}</select></div>
      <h2 className="text-2xl mt-6">{PACKAGES[b.pkg].name} package · {ROOMS[b.room]} · {b.area} sq ft <span className="text-sm text-muted font-body">({b.id})</span></h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">{stats.map(([l, v]) => <div key={l} className="card p-5"><p className="text-xs text-muted">{l}</p><p className="text-xl font-bold mt-1">{v}</p></div>)}</div>
      <div className="card p-6 mt-6 flex flex-wrap items-center gap-6"><Ring pct={pct} /><div><p className="font-display text-xl">{b.phase >= PHASES.length ? 'Your project is complete 🎉' : `Now: ${PHASES[b.phase]}`}</p><p className="text-sm text-muted mt-1">{b.phase} of {PHASES.length} milestones done · about {b.weeks.slice(b.phase).reduce((a, x) => a + x, 0)} weeks remaining</p></div></div>
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="card p-8 print:hidden"><h3 className="text-2xl mb-6">Project Timeline</h3><Timeline phase={b.phase} weeks={b.weeks} /></div>
        <div className="space-y-6">
          <div className="card p-8"><div className="flex justify-between items-center mb-4"><h3 className="text-2xl">Quote</h3><button className="btn-line !py-2 !px-5 text-sm print:hidden" onClick={() => window.print()}>Download PDF</button></div>
            <div className="text-sm space-y-2"><Row l={`${q.pkgName} · ${q.area} sq ft`} v={money(q.base)} />{q.items.map((i) => <Row key={i.label} l={i.label} v={money(i.amount)} />)}{q.rushFee > 0 && <Row l="Fast-track" v={money(q.rushFee)} />}{q.credit > 0 && <Row l={`${CONSULT[b.ctype][0]} credit`} v={'-' + money(q.credit)} />}</div>
            <div className="flex justify-between border-t border-line mt-4 pt-4 font-bold text-lg"><span>Total</span><span>{money(b.total)}</span></div>
            <p className="text-xs text-muted mt-3">Prepared {new Date(b.createdAt).toLocaleDateString()} for {b.name}. Estimate only; confirmed after consultation.</p></div>
          <div className="card p-6 print:hidden"><h3 className="text-xl mb-3">Chat with your designer</h3><Chat bookingId={b.id} me="client" /></div>
          <div className="card p-6 print:hidden"><h3 className="text-xl mb-3">Room photos</h3>{b.photos.length ? <div className="grid grid-cols-4 gap-2">{b.photos.map((p, i) => <img key={i} src={p} alt={`Room ${i + 1}`} className="rounded-xl object-cover aspect-square" />)}</div> : <p className="text-sm text-muted">No photos uploaded.</p>}</div>
        </div></div>
    </div>);
}
const Row = ({ l, v }) => <div className="flex justify-between"><span>{l}</span><b>{v}</b></div>;
