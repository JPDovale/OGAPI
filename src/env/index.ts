import { z } from 'zod'

import { AppError } from '@shared/errors/AppError'

import 'dotenv/config'

const envSchema = z.object({
  IS_DEV: z.coerce.boolean().default(false),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('production'),
  STRIPE_API_KEY: z.string(),
  STRIPE_SUCCESS_URL: z.string().url(),
  STRIPE_CANCEL_URL: z.string().url(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  SENDINBLUE_API_KEY: z.string(),
  TEST_APP_URL: z.string().url().nullable().optional(),
  FORGOT_MAIL_URL: z
    .string()
    .url()
    .default('http://localhost:3000/user/password/reset?token='),
  FRONT_URL: z.string().url().default('http://localhost:3000/'),

  APP_NAME: z.string().default('OG API'),
  APP_PORT: z.coerce.number().default(3030),

  DATABASE_MONGO_URL: z.string().url(),

  MAILGUN_API_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),
  MAILGUN_HOST: z.string(),
  MAILGUN_PORT: z.coerce.number(),
  MAILGUN_PASS: z.string(),

  SECRET_TOKEN: z.string(),
  EXPIRES_IN_TOKEN: z.string(),

  SECRET_REFRESH_TOKEN: z.string(),
  EXPIRES_IN_REFRESH_TOKEN: z.string(),
  EXPIRES_IN_REFRESH_TOKEN_DAYS: z.string(),

  API_KEY: z.string(),
  AUTH_DOMAIN: z.string(),
  PROJECT_ID: z.string(),
  STORAGE_BUCKET: z.string(),
  MESSAGING_SENDER_ID: z.string(),
  APP_ID: z.string(),
  MEASUREMENT_ID: z.string(),

  DNS_SENTRY: z.string().url(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),

  ID_PROJECT_WELCOME: z.string(),
})

const _env = envSchema.safeParse(process.env)

// eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
if (_env.success === false) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables', _env.error.format())

  throw new AppError({
    title: 'Invalid environment variables',
    message: 'Invalid environment variables',
    statusCode: 500,
  })
}

export const env = _env.data
