'use client';
import { useRef } from 'react';
export default function Tilt({ children, className = '', max = 10 }) {
  const ref = useRef();
  const move = (e) => { const r = ref.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; ref.current.style.transform = `perspective(800px) rotateY(${x * max}deg) rotateX(${-y * max}deg) scale(1.02)`; };
  return <div ref={ref} onMouseMove={move} onMouseLeave={() => (ref.current.style.transform = '')} className={`transition-transform duration-200 will-change-transform ${className}`}>{children}</div>;
}
