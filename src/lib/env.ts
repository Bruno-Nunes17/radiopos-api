import { z } from "zod"

const schema = z.object({
  DATABASE_URL:      z.string().url(),
  JWT_SECRET:        z.string().min(32),
  JWT_EXPIRY:        z.string().default("15m"),
  JWT_REFRESH_EXPIRY:z.string().default("7d"),
  PORT:              z.coerce.number().default(4000),
  NODE_ENV:          z.enum(["development","production","test"]),
  CORS_ORIGIN:       z.string().url(),
})

export const env = schema.parse(process.env)
