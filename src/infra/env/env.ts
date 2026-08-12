import { z } from 'zod'

export const envSchema = z.object({
  APP_URL: z.string().url(),
  APP_PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
