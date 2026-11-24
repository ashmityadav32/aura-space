import BookingWizard from '@/components/BookingWizard';
export const metadata = { title: 'Book a Consultation | Aura Space' };
export default function Page() {
  return (<div className="mx-auto max-w-6xl px-6 py-14">
    <div className="text-center mb-10"><h1 className="text-4xl font-bold">Plan &amp; price your <span className="text-clay">project</span></h1><p className="mt-3 text-muted">Upload your room, pick a package, see your quote, then book.</p></div>
    <BookingWizard /></div>);
}
