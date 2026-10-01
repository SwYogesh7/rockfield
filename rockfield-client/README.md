# Rockfield Client

Next.js 16 frontend for **Rockfield** — a shoe-only e-commerce store (India, ₹).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Zustand · Framer Motion · Lenis · pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint (zero warnings) |
| `pnpm typecheck` | TypeScript check |
| `pnpm format` | Prettier |

## Project Structure

```
src/
  app/          # Next.js App Router pages + layouts
  components/   # UI components (layout/, product/, sections/, shop/, ui/)
  config/       # Env validation (Zod)
  constants/    # App-wide constants + helpers
  lib/          # Fonts, mock data, hooks, utils
  services/     # Data access layer (mock → real API in P14)
  store/        # Zustand stores (cart)
  types/        # Domain types (source of truth)
```

## Design

Premium, editorial. Ivory/gold/dark palette. Cormorant Garamond (display) + Jost (body). Mobile-first.

## Money

All prices stored as integer **paise** (₹1 = 100 paise). Use `formatPrice()` from `constants/` for display only.

## Data

Mock data lives in `src/lib/mock-data.ts`. All access goes through `src/services/`. Swap implementations there for the real API in Phase 14 — callers stay unchanged.
