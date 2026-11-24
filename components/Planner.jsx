'use client';
import { useState, useRef, useEffect } from 'react';
import { useToast } from './Toast';
const W = 600, H = 400, snap = (v) => Math.round(v / 10) * 10, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TYPES = { sofa: ['Sofa', 200, 90, '#C89B8B'], bed: ['Bed', 200, 160, '#B8A9C9'], table: ['Table', 120, 80, '#8C6A4F'], chair: ['Chair', 50, 50, '#6B8F71'], wardrobe: ['Wardrobe', 120, 60, '#5B5F66'], rug: ['Rug', 240, 160, '#E8C8B8'], plant: ['Plant', 40, 40, '#4E8B5A'], tv: ['TV unit', 160, 40, '#3D352E'] };
const dims = (i) => (i.rot ? [TYPES[i.type][2], TYPES[i.type][1]] : [TYPES[i.type][1], TYPES[i.type][2]]);
export default function Planner() {
  const [items, setItems] = useState([]), [sel, setSel] = useState(null), [drag, setDrag] = useState(null), cv = useRef(), toast = useToast();
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem('aura_layout')) || []); } catch {} }, []);
  const add = (type) => { const id = Date.now(); setItems([...items, { id, type, x: snap(180 + items.length * 20), y: snap(120 + items.length * 20), rot: 0 }]); setSel(id); };
  const down = (e, it) => { e.stopPropagation(); const r = cv.current.getBoundingClientRect(); setSel(it.id); setDrag({ id: it.id, dx: e.clientX - r.left - it.x, dy: e.clientY - r.top - it.y }); cv.current.setPointerCapture(e.pointerId); };
  const move = (e) => { if (!drag) return; const r = cv.current.getBoundingClientRect(), it = items.find((i) => i.id === drag.id), [w, h] = dims(it); setItems(items.map((i) => (i.id === drag.id ? { ...i, x: snap(clamp(e.clientX - r.left - drag.dx, 0, W - w)), y: snap(clamp(e.clientY - r.top - drag.dy, 0, H - h)) } : i))); };
  const rotate = () => setItems(items.map((i) => { if (i.id !== sel) return i; const n = { ...i, rot: i.rot ? 0 : 1 }, [w, h] = dims(n); return { ...n, x: clamp(n.x, 0, W - w), y: clamp(n.y, 0, H - h) }; }));
  const used = items.reduce((s, i) => s + dims(i)[0] * dims(i)[1], 0);
  return (
    <div><div className="flex flex-wrap gap-2 mb-4">{Object.entries(TYPES).map(([k, t]) => <button key={k} onClick={() => add(k)} className="px-4 py-2 rounded-full text-sm font-medium border border-line hover:border-clay hover:-translate-y-0.5 transition"><span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: t[3] }} />{t[0]}</button>)}</div>
      <div className="overflow-x-auto pb-2"><div ref={cv} onPointerMove={move} onPointerUp={() => setDrag(null)} onPointerDown={() => setSel(null)} className="relative touch-none rounded-2xl border-2 border-ink/70 bg-surface" style={{ width: W, height: H, backgroundImage: 'linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        {items.map((it) => { const [w, h] = dims(it); return <div key={it.id} onPointerDown={(e) => down(e, it)} className={`absolute flex items-center justify-center text-[11px] font-semibold text-white rounded-lg cursor-move select-none shadow-md ${sel === it.id ? 'ring-4 ring-clay' : ''}`} style={{ left: it.x, top: it.y, width: w, height: h, background: TYPES[it.type][3] }}>{TYPES[it.type][0]}</div>; })}
        {!items.length && <p className="absolute inset-0 flex items-center justify-center text-muted text-sm">Add furniture above, then drag it around the room</p>}</div></div>
      <div className="flex flex-wrap items-center gap-3 mt-4"><button disabled={!sel} onClick={rotate} className="btn-line !py-2 !px-5 text-sm">Rotate</button><button disabled={!sel} onClick={() => { setItems(items.filter((i) => i.id !== sel)); setSel(null); }} className="btn-line !py-2 !px-5 text-sm">Delete</button><button onClick={() => { setItems([]); setSel(null); }} className="btn-line !py-2 !px-5 text-sm">Clear</button>
        <button onClick={() => { localStorage.setItem('aura_layout', JSON.stringify(items)); toast('Layout saved in this browser'); }} className="btn-dark !py-2 !px-5 text-sm">Save layout</button>
        <span className="text-sm text-muted ml-auto">Room 6 m × 4 m · {Math.round((used / (W * H)) * 100)}% filled</span></div></div>);
}
