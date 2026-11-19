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
# Install all workspace dependencies
npm install

# Run the Next.js dev server
npm run dev

# Run the API dev server
npm run dev --workspace=apps/rockfield-api
```
