import PageHero from '@/components/PageHero';
import Tilt from '@/components/Tilt';
export const metadata = { title: 'About | Aura Space' };
const team = [['Evelyn Sterling', 'Principal Designer', 'evelyn_sterling.jpg'], ['Liam Thorne', 'Lead Architect', 'liam_thorne.jpg'], ['Elena Voss', 'Colour & Materials', 'elena_voss.jpg']];
export default function About() {
  return (<><PageHero title="About Aura Space" sub="Thoughtful interiors, delivered through a transparent digital process." />
    <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
      <div><h2 className="text-3xl font-bold">Design should feel effortless</h2><p className="mt-4 text-muted">Aura Space moves the interior design consultation online: share your room, pick a package, receive an instant itemised quote and follow every milestone from concept to handover.</p>
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">{[['120+', 'Projects'], ['98%', 'Satisfaction'], ['12', 'Years']].map(([n, l]) => <div key={l} className="card p-4"><p className="text-2xl font-bold text-clay-dark">{n}</p><p className="text-xs text-muted">{l}</p></div>)}</div></div>
      <img src="/images/why_choose_us.jpg" alt="Designed living space" className="rounded-3xl w-full h-80 object-cover" /></section>
    <section className="bg-sand py-16"><div className="mx-auto max-w-6xl px-6"><h2 className="text-3xl font-bold text-center">Meet the team</h2>
      <div className="grid sm:grid-cols-3 gap-6 mt-10">{team.map(([n, r, i]) => <Tilt key={n}><div className="card overflow-hidden text-center"><img src={`/images/${i}`} alt={n} className="w-full h-64 object-cover" /><div className="p-5"><h3 className="text-lg">{n}</h3><p className="text-sm text-muted">{r}</p></div></div></Tilt>)}</div></div></section></>);
}
