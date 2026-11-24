import { PHASES } from '@/lib/pricing';
export default function Timeline({ phase, weeks }) {
  return (
    <ol className="relative border-s-2 border-line ms-3 space-y-7">
      {PHASES.map((p, i) => { const st = i < phase ? 'done' : i === phase ? 'now' : 'next'; return (
        <li key={p} className="ms-8 relative">
          <span className={`absolute -start-[45px] w-7 h-7 rounded-full flex items-center justify-center text-xs ${st === 'next' ? 'bg-sand' : 'bg-clay text-white'}`}>{st === 'done' ? '✓' : i + 1}</span>
          <h4 className="font-semibold font-body">{p} {st === 'now' && <span className="ms-2 text-xs bg-sand px-2 py-0.5 rounded-full">In progress</span>}</h4>
          <p className="text-sm text-muted">{weeks[i]} week{weeks[i] > 1 ? 's' : ''}</p>
        </li>); })}
    </ol>);
}
