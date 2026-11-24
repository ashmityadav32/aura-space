'use client';
import { useEffect, useState } from 'react';
export default function TypedWords({ words }) {
  const [i, setI] = useState(0), [n, setN] = useState(0), [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i], t = setTimeout(() => {
      if (!del && n < w.length) setN(n + 1); else if (!del) setDel(true); else if (n > 0) setN(n - 1); else { setDel(false); setI((i + 1) % words.length); }
    }, !del && n === w.length ? 1400 : del ? 40 : 90);
    return () => clearTimeout(t);
  }, [n, del, i, words]);
  return <span className="hero-text">{words[i].slice(0, n)}<span className="text-clay animate-pulse">|</span></span>;
}
