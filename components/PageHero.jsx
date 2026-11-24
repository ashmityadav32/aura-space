import ParallaxImg from './ParallaxImg';
export default function PageHero({ title, sub, img = 'hero_bg_index.jpg' }) {
  return (<section className="relative h-72 flex items-center text-center text-white overflow-hidden"><ParallaxImg src={`/images/${img}`} /><div className="absolute inset-0 bg-black/60" /><div className="relative mx-auto max-w-2xl px-6"><h1 className="text-4xl md:text-5xl font-bold">{title}</h1><p className="mt-3 text-white/90">{sub}</p></div></section>);
}
