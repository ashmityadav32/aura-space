'use client';
import { useState } from 'react';
const items = [['How does the online consultation work?', 'Upload photos of your room, choose a package, and book a slot. Your designer reviews everything before the call.'], ['Is the quote final?', 'It is an itemised estimate based on area, package and add-ons. We confirm the final figure after your consultation.'], ['Is the consultation fee credited?', 'Yes. The consultation fee is deducted from your project quote if you proceed with us.'], ['Can I track my project?', 'Yes. Your dashboard shows each phase, estimated weeks and progress in real time.']];
export default function FAQ() {
  const [o, setO] = useState(0);
  return <div className="card divide-y divide-line">{items.map(([q, a], i) => <div key={q} className="p-5"><button className="w-full flex justify-between text-left font-semibold" aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}>{q}<span className={`text-clay transition-transform ${o === i ? 'rotate-45' : ''}`}>+</span></button>{o === i && <p className="mt-3 text-sm text-muted">{a}</p>}</div>)}</div>;
}
