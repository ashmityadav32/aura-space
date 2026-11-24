import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import ToastProvider from '@/components/Toast';
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });
export const metadata = { title: 'Aura Space | Interior Design Consultation Portal', description: 'Book interior design consultations online: upload your room, choose a package, get an instant quote and track your project.' };
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${body.variable} ${display.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: "try{var d=document.documentElement;if(localStorage.theme=='dark')d.classList.add('dark');if(localStorage.dir==='rtl')d.dir='rtl'}catch(e){}" }} /></head>
      <body><ToastProvider><ScrollProgress /><Navbar /><main className="pt-20 print:pt-0 min-h-screen">{children}</main>
        <footer className="print:hidden bg-ink text-cream/80 text-sm"><div className="mx-auto max-w-6xl px-6 py-10 flex flex-wrap justify-between gap-4"><span className="font-display text-xl text-white">AURA<span className="text-clay">SPACE</span></span><span>© {new Date().getFullYear()} Aura Space. Final Year Project.</span></div></footer>
      </ToastProvider></body>
    </html>
  );
}
