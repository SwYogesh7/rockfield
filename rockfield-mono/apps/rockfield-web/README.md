# Rockfield Client

Next.js 16 frontend for **Rockfield** — a shoe-only e-commerce store (India, ₹).

## Stack

Next.js 16.2.6 (App Router) · React 19.2.4 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui · Zustand 5 · Framer Motion 12 · Lenis · npm

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (zero warnings) |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Prettier |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run test:e2e:report` | Open last Playwright HTML report |

## Offline Setup

For machines with no internet access:

```bash
# Install dependencies from a local npm mirror
npm ci

# Start the dev server in the background (tests use port 3001)
npm run dev -- --port 3001 &

# Run end-to-end tests with the system Chrome
CHROME_PATH=/path/to/chrome npm run test:e2e
```

Fonts (Cormorant Garamond, Jost) are self-hosted in `src/fonts/` — no network needed at build or runtime.

Copy `.env.example` to `.env.local` and adjust values. `PAYMENT_PROVIDER=mock` is the default and requires no external service.

## Project Structure

```
src/
  app/          # Next.js App Router pages + layouts
  components/   # UI components (layout/, product/, sections/, shop/, ui/)
  config/       # Env validation (Zod)
  constants/    # App-wide constants + helpers
  fonts/        # Self-hosted woff2 font files
  lib/          # Fonts, mock data, hooks, utils
  services/     # Data access layer (mock)
  store/        # Zustand stores (cart)
  types/        # Domain types (source of truth)
```

## Design

Premium, editorial. Ivory/gold/dark palette. Cormorant Garamond (display) + Jost (body). Mobile-first.

## Money

All prices stored as integer **paise** (₹1 = 100 paise). Use `formatPrice()` from `constants/` for display only.

## Data

All product data is made-up mock data. It lives in `src/lib/mock-data.ts`. All access goes through `src/services/`. There is no backend or database connection in this codebase.
