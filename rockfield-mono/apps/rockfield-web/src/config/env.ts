// src/config/env.ts
// Validated environment variables. Import `env` everywhere instead of process.env directly.
// This gives compile-time types and runtime validation on startup.
import { z } from 'zod'

const envSchema = z.object({
  // Public — safe to expose to the browser
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Server-only — never sent to browser
  PAYMENT_PROVIDER: z.string().default('mock'),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
})

// Parse and validate. Will throw at startup if required vars are missing.
// Use `.safeParse` in tests to avoid throwing.
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
})

if (!parsed.success) {
  console.error('Invalid environment variables:', z.flattenError(parsed.error).fieldErrors)
  // Only throw in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Invalid environment variables — check .env.local')
  }
}

export const env = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>)
