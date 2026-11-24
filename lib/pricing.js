// Shared by the browser (live quote) and the server (authoritative quote on save).
export const PACKAGES = {
  essential: { name: 'Essential', rate: 8,  blurb: 'Layout, mood board and shopping list for one space.', features: ['Space planning', 'Mood board', 'Shopping list'], weeks: [1, 2, 3, 3, 2] },
  signature: { name: 'Signature', rate: 15, blurb: 'Full concept, 3D views and vendor coordination.', features: ['Everything in Essential', '3D visuals', 'Vendor coordination', 'Two revision rounds'], weeks: [1, 3, 4, 5, 3] },
  luxury:    { name: 'Luxury',    rate: 28, blurb: 'End-to-end design, custom pieces and site supervision.', features: ['Everything in Signature', 'Custom furniture', 'On-site supervision', 'Unlimited revisions'], weeks: [1, 4, 6, 8, 4] },
};
export const ADDONS = { render: ['3D renders', 450], light: ['Lighting plan', 600], proc: ['Procurement management', 900], art: ['Art & styling', 350] };
export const CONSULT = { discovery: ['Discovery Call', 0], virtual: ['Virtual Consult', 149], home: ['In-Home Studio', 349] };
export const PHASES = ['Consultation', 'Concept & Mood Board', 'Design Development', 'Procurement', 'Installation & Handover'];
export const ROOMS = { living: 'Living Room', bedroom: 'Bedroom', kitchen: 'Kitchen', bathroom: 'Bathroom', full: 'Full Home', office: 'Home Office' };
export const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

export function calcQuote({ pkg, area, addons = {}, rush = false, ctype = 'discovery' }) {
  const p = PACKAGES[pkg], a = Math.min(Math.max(+area || 0, 100), 4000), base = a * p.rate;
  const items = Object.keys(addons).filter((k) => addons[k] && ADDONS[k]).map((k) => ({ label: ADDONS[k][0], amount: ADDONS[k][1] }));
  const rushFee = rush ? base * 0.15 : 0, credit = CONSULT[ctype]?.[1] ?? 0;
  const total = Math.max(0, base + items.reduce((s, i) => s + i.amount, 0) + rushFee - credit);
  const f = 1 + a / 4000, weeks = p.weeks.map((w) => Math.max(1, Math.ceil(w * f * (rush ? 0.8 : 1))));
  return { base, items, rushFee, credit, total, weeks, area: a, pkgName: p.name };
}
