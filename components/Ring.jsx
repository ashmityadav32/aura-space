export default function Ring({ pct, size = 120 }) {
  const r = size / 2 - 8, C = 2 * Math.PI * r;
  return (<div className="relative" style={{ width: size, height: size }}><svg width={size} height={size} className="-rotate-90"><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--sand))" strokeWidth="10" /><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--clay))" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 1.2s ease' }} /></svg><span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold">{pct}%</span></div>);
}
