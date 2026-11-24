# Project Report Pack: Aura Space

## 1. Suggested report outline
1. Introduction (problem, objectives, scope)  2. Literature / existing systems  3. Requirement analysis (functional, non-functional)  4. System design (diagrams below)  5. Implementation (stack, modules, key code)  6. Testing (table below)  7. Results (screenshots)  8. Conclusion and future work  9. References

## 2. Requirements
**Functional:** user registration/login · room photo upload · design package selection · quote calculator · consultation booking · project timeline · client dashboard · admin dashboard (bookings, clients, messages, analytics) · password reset · email confirmation · dark mode / RTL.
**Non-functional:** responsive UI, password hashing, role-based access, server-side validation, accessible controls, fast page loads.

## 3. Use-case diagram
```mermaid
flowchart LR
  V([Visitor]) --> A1(Browse pages) & A2(Contact us) & A3(Sign up / Log in)
  C([Client]) --> B1(Upload room photos) & B2(Select package) & B3(Calculate quote) & B4(Book consultation) & B5(View timeline and dashboard) & B6(Download quote PDF)
  AD([Admin]) --> D1(View analytics) & D2(Manage bookings and stages) & D3(View clients) & D4(Handle messages) & D5(Export CSV)
```

## 4. ER diagram
```mermaid
erDiagram
  USERS ||--o{ BOOKINGS : places
  USERS ||--o{ RESETS : requests
  USERS { string id PK
    string name
    string email UK
    string role
    string hash }
  BOOKINGS { string id PK
    string userId FK
    string room
    int area
    string pkg
    float total
    int phase
    string status
    json photos }
  MESSAGES { string id PK
    string name
    string email
    string message
    bool read }
  RESETS { string id PK
    string userId FK
    int exp }
```

## 5. Booking flow
```mermaid
flowchart TD
  S([Start]) --> R[Enter room details and photos] --> P[Choose package] --> Q[Add-ons and live quote] --> L{Logged in?}
  L -- No --> LG[Log in / Sign up] --> Sc
  L -- Yes --> Sc[Pick date and time] --> V[Server validates and recalculates quote] --> DB[(SQLite)] --> M[Confirmation email] --> D([Dashboard timeline])
```

## 6. Sequence: password reset
```mermaid
sequenceDiagram
  User->>Server: POST /api/auth/forgot (email)
  Server->>DB: store SHA-256(token) + expiry
  Server-->>User: email with reset link
  User->>Server: POST /api/auth/reset (token, new password)
  Server->>DB: verify token, update bcrypt hash, delete token
  Server-->>User: success
```

## 7. Test cases
| ID | Scenario | Expected |
|---|---|---|
| T1 | Sign up with existing email | 409 error shown |
| T2 | Password under 6 chars | Rejected |
| T3 | Book while logged out | Prompted to log in; selections kept |
| T4 | Client requests another user's booking | Not returned |
| T5 | Client calls `PATCH /api/bookings/:id` | 403 Forbidden |
| T6 | Tamper quote in request body | Server recalculates total |
| T7 | Expired/invalid reset token | Error message |
| T8 | Admin changes stage | Client timeline updates |
| T9 | Toggle dark / RTL, reload | Preference persists |
| T10 | Export CSV with filter | Only filtered rows exported |

## 8. Future work
Payments (Stripe/Razorpay), cloud image storage, calendar sync, real-time chat with the designer, PostgreSQL + Prisma, automated tests (Jest/Playwright).
