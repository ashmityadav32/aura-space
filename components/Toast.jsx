'use client';
import { createContext, useContext, useState, useCallback } from 'react';
const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);
export default function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const toast = useCallback((text, type = 'ok') => { const id = Math.random(); setList((l) => [...l, { id, text, type }]); setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 3500); }, []);
  return (<Ctx.Provider value={toast}>{children}
    <div aria-live="polite" className="print:hidden fixed bottom-6 left-6 z-[100] space-y-2">{list.map((t) => <div key={t.id} className="page-in flex items-center gap-3 bg-ink text-cream px-5 py-3 rounded-2xl shadow-xl text-sm"><span className={t.type === 'err' ? 'text-red-400' : 'text-clay'}>{t.type === 'err' ? '✕' : '✓'}</span>{t.text}</div>)}</div></Ctx.Provider>);
}
