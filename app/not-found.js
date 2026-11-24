import Link from 'next/link';
export default function NotFound() { return <div className="text-center py-32 px-6"><p className="text-clay text-6xl font-display font-bold">404</p><h1 className="text-3xl mt-3">Page not found</h1><Link href="/" className="btn-dark mt-8">Back home</Link></div>; }
