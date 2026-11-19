import { z } from "zod";

// Add shared Zod schemas here — imported by both rockfield-web and rockfield-api
export const ExampleSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type Example = z.infer<typeof ExampleSchema>;
