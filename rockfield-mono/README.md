# rockfield-mono

npm workspaces monorepo for the Rockfield platform.

## Structure

```
rockfield-mono/
├── apps/
│   ├── rockfield-web    # Next.js storefront
│   └── rockfield-api    # Fastify + TypeScript API
├── packages/
│   └── shared           # Shared Zod schemas and types
└── scripts/
```

## Getting started

```bash
# Install all workspace dependencies (run from this folder)
npm install

# Run the Next.js dev server
npm run dev

# Run the API dev server
npm run dev:api

# Run Playwright e2e tests
npm run test:e2e
```

## Note on `rockfield-client`

The repo root also contains a `rockfield-client/` folder — that is the older standalone Next.js version. `rockfield-mono/apps/rockfield-web` is the current version and supersedes it.
