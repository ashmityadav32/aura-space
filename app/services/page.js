import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Tilt from '@/components/Tilt';
export const metadata = { title: 'Services | Aura Space' };
const items = [['Concept Development', 'service_concept.jpg', 'Mood boards, layouts and a clear design direction.'], ['Colour & Material Palette', 'service_palette.jpg', 'Curated palettes, finishes and textures.'], ['Lighting Design', 'service_lighting.jpg', 'Layered lighting plans for mood and function.'], ['Procurement', 'service_procurement.jpg', 'Sourcing, ordering and delivery coordination.']];
export default function Services() {
  return (<><PageHero title="Our Services" sub="From first idea to final installation." />
    <section className="mx-auto max-w-6xl px-6 py-16 grid sm:grid-cols-2 gap-6">{items.map(([t, i, d]) => <Tilt key={t}><div className="card overflow-hidden h-full"><img src={`/images/${i}`} alt={t} className="h-56 w-full object-cover" /><div className="p-6"><h3 className="text-xl">{t}</h3><p className="text-muted text-sm mt-2">{d}</p></div></div></Tilt>)}</section>
    <div className="text-center pb-16"><Link href="/consultation" className="btn-dark">Get an instant quote</Link></div></>);
}
