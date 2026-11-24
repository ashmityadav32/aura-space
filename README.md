# Aura Space: Interior Design Consultation Portal (Next.js)

Book interior design consultations online: room upload, design package selection, quote calculator, project timeline and dashboards.

## Tech stack
Next.js 14 (App Router) · React 18 · Tailwind CSS · REST Route Handlers · JWT cookie auth (jose) · bcrypt password hashing · SQLite (better-sqlite3) · Nodemailer

## Run
```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
# Admin login: admin@aura.com / admin123 (seeded on first run; change via .env.local)
```

## Features -> requirement mapping
| Requirement | Where |
|---|---|
| Room upload | `components/BookingWizard.jsx` step 1 (client-side image compression) |
| Design package selection | Wizard step 2, `lib/pricing.js` |
| Quote calculator | Wizard step 3 + live summary; recomputed server-side in `app/api/bookings/route.js` |
| Project timeline | `components/Timeline.jsx`, phases scale with area and package |
| Dashboard | `/dashboard` (client lookup by reference + email), `/admin` (manage all bookings) |

## Pages
`/` Home · `/about` · `/services` · `/portfolio` (filter) · `/consultation` (wizard) · `/contact` · `/login` · `/signup` · `/dashboard` (client) · `/admin` (overview charts, bookings search/filter/detail/CSV export, clients, messages) · custom 404

## API
| Route | Access |
|---|---|
| `POST /api/auth/signup`, `/login`, `/logout`; `GET /api/auth/me` | public / session |
| `POST /api/bookings` | logged-in user (server recomputes quote) |
| `GET /api/bookings` | client: own bookings, admin: all |
| `PATCH` / `DELETE /api/bookings/:id` | admin only |
| `POST /api/contact`; `GET /api/contact` | public; admin only |
| `PATCH` / `DELETE /api/contact/:id` | admin only (mark read, delete) |
| `GET /api/users` | admin only (client list, no password hashes) |

## Security notes
Passwords hashed with bcrypt; sessions are signed HttpOnly JWT cookies; role checks happen server-side on every protected route; input validated server-side.

## Extras
Dark mode and RTL toggles (saved in the browser) · email confirmation and password reset (emails print to the terminal unless SMTP is set in `.env.local`) · `docs/REPORT.md` has the outline, ER/use-case/flow/sequence diagrams (Mermaid) and test cases.

## Visual & interactive features
CSS-3D room (drag to rotate) with palette picker · Design Studio with drag-and-drop room planner · Style Quiz · tilt cards and parallax · before/after slider · live quote teaser · toasts and loading skeletons · animated admin counters and line chart · per-project live chat (client and admin, polling every 4 s; `/api/chat`).

## Limitations / future work
Move to PostgreSQL + Prisma, add payments, cloud image storage, rate limiting, automated tests, payments and image storage (S3/Cloudinary).
