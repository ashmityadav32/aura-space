'use client';
import { useEffect, useRef } from 'react';
const S = 260, H = S / 2;
const Face = ({ w, h, t, bg, b = 1 }) => <div style={{ position: 'absolute', left: '50%', top: '50%', width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform: t, background: bg, filter: `brightness(${b})`, backfaceVisibility: 'hidden' }} />;
function Box({ w, h, d, x, y, z, c }) { // a CSS 3D box built from five faces
  return (<div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translate3d(${x}px,${y}px,${z}px)` }}>
    <Face w={w} h={h} t={`translateZ(${d / 2}px)`} bg={c} />
    <Face w={w} h={h} t={`rotateY(180deg) translateZ(${d / 2}px)`} bg={c} b={0.7} />
    <Face w={d} h={h} t={`rotateY(90deg) translateZ(${w / 2}px)`} bg={c} b={0.85} />
    <Face w={d} h={h} t={`rotateY(-90deg) translateZ(${w / 2}px)`} bg={c} b={0.75} />
    <Face w={w} h={d} t={`rotateX(90deg) translateZ(${h / 2}px)`} bg={c} b={1.12} />
  </div>);
}
export default function Room3D({ wall, floor, sofa, accent }) {
  const scene = useRef(), ang = useRef(-30), drag = useRef(null);
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches; let id;
    const loop = () => { if (!drag.current && !still) ang.current += 0.25; if (scene.current) scene.current.style.transform = `scale(1.15) rotateX(-22deg) rotateY(${ang.current}deg)`; id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop); return () => cancelAnimationFrame(id);
  }, []);
  const fl = `repeating-linear-gradient(90deg, ${floor} 0 38px, rgb(0 0 0 / .1) 38px 40px)`;
  return (
    <div role="img" aria-label="Interactive 3D room preview. Drag to rotate." className="relative h-[380px] cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden rounded-3xl bg-gradient-to-b from-sand to-surface border border-line" style={{ perspective: 1100 }}
      onPointerDown={(e) => { drag.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={(e) => { if (drag.current !== null) { ang.current += (e.clientX - drag.current) * 0.5; drag.current = e.clientX; } }} onPointerUp={() => (drag.current = null)}>
      <div ref={scene} style={{ position: 'absolute', left: '50%', top: '52%', width: 0, height: 0, transformStyle: 'preserve-3d' }}>
        <Face w={S} h={S} t={`rotateX(90deg) translateZ(${-H}px)`} bg={fl} />
        <Face w={S} h={S} t={`translateZ(${-H}px)`} bg={wall} />
        <Face w={S} h={S} t={`rotateY(90deg) translateZ(${-H}px)`} bg={wall} b={0.92} />
        <Face w={S} h={S} t={`rotateY(-90deg) translateZ(${-H}px)`} bg={wall} b={0.86} />
        <Face w={90} h={100} t={`translate3d(-50px,-20px,${-H + 1}px)`} bg="linear-gradient(#bfe3ff,#eaf6ff)" />
        <Face w={70} h={90} t={`rotateY(90deg) translate3d(0,-25px,${-H + 1}px)`} bg={accent} />
        <Box w={130} h={2} d={96} x={0} y={H - 1} z={20} c={accent} />
        <Box w={112} h={26} d={46} x={0} y={H - 13} z={-85} c={sofa} />
        <Box w={112} h={32} d={12} x={0} y={H - 42} z={-102} c={sofa} />
        <Box w={50} h={18} d={36} x={0} y={H - 9} z={25} c="#8C6A4F" />
        <Box w={4} h={64} d={4} x={-98} y={H - 32} z={-100} c="#3D352E" />
        <Box w={24} h={16} d={24} x={-98} y={H - 72} z={-100} c={accent} />
      </div>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted bg-surface/80 px-3 py-1 rounded-full">Drag to rotate</span>
    </div>);
}
