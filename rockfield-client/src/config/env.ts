// src/config/env.ts
// Validated environment variables. Import `env` everywhere instead of process.env directly.
// This gives compile-time types and runtime validation on startup.
import { z } from 'zod'

const envSchema = z.object({
  // Public — safe to expose to the browser
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://rockfieldshoes.in'),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),

  // Server-only — never sent to browser
  RAZORPAY_KEY_SECRET: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
})

// Parse and validate. Will throw at startup if required vars are missing.
// Use `.safeParse` in tests to avoid throwing.
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
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
