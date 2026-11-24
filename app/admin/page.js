'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PACKAGES, ROOMS, PHASES, ADDONS, CONSULT, money } from '@/lib/pricing';
import Timeline from '@/components/Timeline';
import CountUp from '@/components/CountUp';
import Chat from '@/components/Chat';
import { useToast } from '@/components/Toast';
import { PageSkeleton } from '@/components/Skeleton';
import useUser from '@/components/useUser';

const TABS = [['overview', 'Overview', '▦'], ['bookings', 'Bookings', '☰'], ['clients', 'Clients', '☺'], ['messages', 'Messages', '✉']];
const json = (u) => fetch(u, { cache: 'no-store' }).then((r) => r.json());
const call = (u, method, body) => fetch(u, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
const label = (b) => (b.phase >= PHASES.length ? 'Completed' : PHASES[b.phase]);

export default function Admin() {
  const user = useUser(), [tab, setTab] = useState('overview'), [d, setD] = useState(null);
  async function load() { const [bookings, clients, messages] = await Promise.all([json('/api/bookings'), json('/api/users'), json('/api/contact')]); setD({ bookings, clients, messages: Array.isArray(messages) ? messages : [] }); }
  useEffect(() => { if (user?.role === 'admin') load(); }, [user]);
  if (user === undefined) return <PageSkeleton />;
  if (user?.role !== 'admin') return <div className="text-center py-28 px-6"><h1 className="text-3xl">Admin access only</h1><p className="text-muted mt-3">Sign in with the admin account.</p><Link href="/login" className="btn-dark mt-6">Log in</Link></div>;
  if (!d) return <PageSkeleton />;
  const unread = d.messages.filter((m) => !m.read).length;
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid lg:grid-cols-[210px_1fr] gap-6">
      <aside className="card p-3 h-fit lg:sticky lg:top-28 flex lg:flex-col gap-1 overflow-x-auto">
        {TABS.map(([k, t, i]) => <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition ${tab === k ? 'bg-ink text-cream' : 'hover:bg-sand'}`}><span>{i}</span>{t}{k === 'messages' && unread > 0 && <span className="ml-auto bg-clay text-white text-xs rounded-full px-2">{unread}</span>}</button>)}
      </aside>
      <section className="min-w-0">
        {tab === 'overview' && <Overview d={d} />}
        {tab === 'bookings' && <Bookings rows={d.bookings} reload={load} />}
        {tab === 'clients' && <Clients rows={d.clients} />}
        {tab === 'messages' && <Messages rows={d.messages} reload={load} />}
      </section>
    </div>);
}

function Bars({ data, fmt = (v) => v }) {
  const max = Math.max(1, ...data.map((x) => x[1]));
  return <div className="space-y-3">{data.map(([l, v]) => <div key={l} className="text-sm"><div className="flex justify-between mb-1"><span>{l}</span><b>{fmt(v)}</b></div><div className="h-2.5 bg-sand rounded-full overflow-hidden"><div className="h-full bg-clay rounded-full transition-all duration-700" style={{ width: (v / max) * 100 + '%' }} /></div></div>)}</div>;
}
function Overview({ d }) {
  const b = d.bookings, active = b.filter((x) => x.phase < PHASES.length).length;
  const cards = [['Total bookings', b.length], ['Active projects', active], ['Completed', b.length - active], ['Clients', d.clients.length], ['Pipeline value', Math.round(b.reduce((s, x) => s + x.total, 0)), 1], ['Unread messages', d.messages.filter((m) => !m.read).length]];
  const byPkg = Object.entries(PACKAGES).map(([k, p]) => [p.name, b.filter((x) => x.pkg === k).length]);
  const byStage = [...PHASES, 'Completed'].map((p, i) => [p, b.filter((x) => x.phase === i).length]);
  const months = Array.from({ length: 6 }, (_, i) => { const dt = new Date(); dt.setMonth(dt.getMonth() - 5 + i); return dt; });
  const rev = months.map((m) => [m.toLocaleString('en', { month: 'short' }), b.filter((x) => { const c = new Date(x.createdAt); return c.getMonth() === m.getMonth() && c.getFullYear() === m.getFullYear(); }).reduce((s, x) => s + x.total, 0)]);
  return (<div className="space-y-6"><h1 className="text-3xl">Overview</h1>
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">{cards.map(([l, v, m]) => <div key={l} className="card p-5 hover:-translate-y-0.5 transition"><p className="text-xs text-muted">{l}</p><p className="text-2xl font-bold mt-1"><CountUp to={v} format={m ? money : undefined} /></p></div>)}</div>
    <div className="grid xl:grid-cols-2 gap-6"><div className="card p-6"><h3 className="text-lg mb-4">Revenue by month (quoted)</h3><LineChart data={rev} /></div><div className="card p-6"><h3 className="text-lg mb-4">Bookings by package</h3><Bars data={byPkg} /></div>
      <div className="card p-6"><h3 className="text-lg mb-4">Projects by stage</h3><Bars data={byStage} /></div>
      <div className="card p-6"><h3 className="text-lg mb-4">Recent bookings</h3>{b.slice(0, 5).map((x) => <div key={x.id} className="flex justify-between py-2.5 border-b border-line last:border-0 text-sm"><span><b>{x.name}</b><br /><span className="text-muted">{ROOMS[x.room]} · {PACKAGES[x.pkg].name}</span></span><span className="text-right font-semibold">{money(x.total)}<br /><span className="text-xs text-muted font-normal">{label(x)}</span></span></div>)}{!b.length && <p className="text-muted text-sm">No bookings yet.</p>}</div></div></div>);
}
function Bookings({ rows, reload }) {
  const toast = useToast();
  const [q, setQ] = useState(''), [st, setSt] = useState('all'), [sel, setSel] = useState(null);
  const list = useMemo(() => rows.filter((r) => (st === 'all' || String(r.phase) === st) && (r.name + r.email + r.id).toLowerCase().includes(q.toLowerCase())), [rows, q, st]);
  const cur = rows.find((r) => r.id === sel);
  const setPhase = async (id, phase) => { await call(`/api/bookings/${id}`, 'PATCH', { phase }); toast('Project stage updated'); reload(); };
  const remove = async (id) => { if (confirm('Delete this booking?')) { await call(`/api/bookings/${id}`, 'DELETE'); toast('Booking deleted'); setSel(null); reload(); } };
  function csv() {
    const h = ['Ref', 'Name', 'Email', 'Room', 'Area', 'Package', 'Total', 'Status', 'Created'], esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const body = list.map((r) => [r.id, r.name, r.email, ROOMS[r.room], r.area, PACKAGES[r.pkg].name, r.total, label(r), r.createdAt].map(esc).join(','));
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([[h.join(','), ...body].join('\n')], { type: 'text/csv' })); a.download = 'bookings.csv'; a.click(); toast('CSV exported');
  }
  return (<div><div className="flex flex-wrap items-center justify-between gap-3 mb-4"><h1 className="text-3xl">Bookings</h1><button className="btn-line !py-2 !px-5 text-sm" onClick={csv}>Export CSV</button></div>
    <div className="flex flex-wrap gap-3 mb-4"><input className="field !w-64" placeholder="Search name, email, ref…" value={q} onChange={(e) => setQ(e.target.value)} /><select className="field !w-auto" value={st} onChange={(e) => setSt(e.target.value)}><option value="all">All stages</option>{[...PHASES, 'Completed'].map((p, i) => <option key={p} value={i}>{p}</option>)}</select></div>
    <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="text-left bg-sand"><tr>{['Ref', 'Client', 'Project', 'Quote', 'Stage', ''].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr></thead><tbody>
      {list.map((r) => <tr key={r.id} className="border-t border-line hover:bg-cream"><td className="p-4 font-mono">{r.id}</td><td className="p-4">{r.name}<br /><span className="text-muted">{r.email}</span></td><td className="p-4">{PACKAGES[r.pkg].name}<br /><span className="text-muted">{ROOMS[r.room]} · {r.area} sq ft</span></td><td className="p-4 font-semibold">{money(r.total)}</td><td className="p-4"><span className="bg-sand px-3 py-1 rounded-full text-xs whitespace-nowrap">{label(r)}</span></td><td className="p-4"><button className="text-clay-dark font-semibold" onClick={() => setSel(r.id)}>View</button></td></tr>)}
      {!list.length && <tr><td colSpan={6} className="p-10 text-center text-muted">No bookings match.</td></tr>}</tbody></table></div>
    {cur && <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setSel(null)}><div role="dialog" aria-modal="true" className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto p-7" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-start"><div><p className="text-xs text-muted font-mono">{cur.id}</p><h2 className="text-2xl">{cur.name}</h2><p className="text-sm text-muted">{cur.email}{cur.phone && ' · ' + cur.phone}</p></div><button aria-label="Close" className="text-2xl" onClick={() => setSel(null)}>×</button></div>
      <div className="grid sm:grid-cols-2 gap-6 mt-6"><div className="text-sm space-y-2">
        <p><b>Project:</b> {PACKAGES[cur.pkg].name} · {ROOMS[cur.room]} · {cur.area} sq ft</p><p><b>Consultation:</b> {CONSULT[cur.ctype][0]}</p><p><b>Preferred slot:</b> {cur.date || 'Not set'} {cur.time}</p>
        <p><b>Add-ons:</b> {Object.keys(cur.addons).filter((k) => cur.addons[k]).map((k) => ADDONS[k][0]).join(', ') || 'None'}{cur.rush && ' · Fast-track'}</p><p><b>Notes:</b> {cur.notes || '—'}</p><p className="text-lg"><b>Quote: {money(cur.total)}</b></p>
        <div><label className="label">Project stage</label><select className="field" value={cur.phase} onChange={(e) => setPhase(cur.id, +e.target.value)}>{[...PHASES, 'Completed'].map((p, i) => <option key={p} value={i}>{p}</option>)}</select></div></div>
        <div className="pl-3"><Timeline phase={cur.phase} weeks={cur.weeks} /></div></div>
      <div className="mt-6"><h3 className="text-lg mb-2">Chat with client</h3><Chat bookingId={cur.id} me="admin" /></div>
      {cur.photos.length > 0 && <div className="grid grid-cols-4 gap-2 mt-6">{cur.photos.map((p, i) => <img key={i} src={p} alt={`Room ${i + 1}`} className="rounded-xl aspect-square object-cover" />)}</div>}
      <div className="mt-6 text-right"><button className="text-red-600 font-semibold text-sm" onClick={() => remove(cur.id)}>Delete booking</button></div></div></div>}
  </div>);
}
function Clients({ rows }) {
  return (<div><h1 className="text-3xl mb-4">Clients</h1><div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="text-left bg-sand"><tr>{['Name', 'Email', 'Joined', 'Bookings'].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr></thead><tbody>
    {rows.map((u) => <tr key={u.id} className="border-t border-line"><td className="p-4 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-clay text-white flex items-center justify-center text-xs font-semibold">{u.name[0]}</span>{u.name}</td><td className="p-4">{u.email}</td><td className="p-4 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td><td className="p-4 font-semibold">{u.bookings}</td></tr>)}
    {!rows.length && <tr><td colSpan={4} className="p-10 text-center text-muted">No clients yet.</td></tr>}</tbody></table></div></div>);
}
function Messages({ rows, reload }) {
  const toast = useToast();
  const act = async (id, m) => { await call(`/api/contact/${id}`, m); toast(m === 'DELETE' ? 'Message deleted' : 'Marked as read'); reload(); };
  return (<div><h1 className="text-3xl mb-4">Messages</h1><div className="space-y-3">{rows.map((m) => <div key={m.id} className={`card p-5 ${m.read ? '' : 'border-l-4 border-l-clay'}`}><div className="flex flex-wrap justify-between gap-2 text-sm"><b>{m.name} · <a className="text-clay-dark" href={`mailto:${m.email}`}>{m.email}</a></b><span className="text-muted">{new Date(m.createdAt).toLocaleString()}</span></div><p className="mt-2 text-sm">{m.message}</p>
    <div className="mt-3 flex gap-4 text-sm font-medium">{!m.read && <button className="text-clay-dark" onClick={() => act(m.id, 'PATCH')}>Mark as read</button>}<button className="text-red-600" onClick={() => act(m.id, 'DELETE')}>Delete</button></div></div>)}
    {!rows.length && <p className="text-muted p-10 text-center">No messages yet.</p>}</div></div>);
}

function LineChart({ data }) {
  const W = 300, H = 120, max = Math.max(1, ...data.map((x) => x[1])), pts = data.map(([, v], i) => [20 + (i * (W - 40)) / (data.length - 1), H - 25 - (v / max) * (H - 45)]), line = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  return (<svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Revenue by month line chart"><path d={`${line} L${pts[pts.length - 1][0]} ${H - 25} L${pts[0][0]} ${H - 25} Z`} fill="rgb(var(--clay) / .15)" />
    <path d={line} pathLength="1" fill="none" stroke="rgb(var(--clay))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="draw" />
    {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="3.5" fill="rgb(var(--clay-dark))"><title>{data[i][0]}: {money(data[i][1])}</title></circle><text x={p[0]} y={H - 8} textAnchor="middle" fontSize="9" fill="rgb(var(--muted))">{data[i][0]}</text></g>)}</svg>);
}
