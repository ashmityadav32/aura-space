'use client';
import { useEffect, useRef } from 'react';
export default function ParallaxImg({ src }) {
  const ref = useRef();
  useEffect(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; const f = () => { if (ref.current) ref.current.style.transform = `translateY(${Math.min(scrollY, 900) * 0.3}px) scale(1.15)`; }; f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f); }, []);
  return <img ref={ref} src={src} alt="" className="absolute inset-0 w-full h-full object-cover will-change-transform" />;
}
