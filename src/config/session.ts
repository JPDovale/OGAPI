import { env } from '@env/index'

export default {
  secretToken: env.SECRET_TOKEN,
  expiresInToken: env.EXPIRES_IN_TOKEN,

  secretRefreshToken: env.SECRET_REFRESH_TOKEN,
  expiresInRefreshToken: env.EXPIRES_IN_REFRESH_TOKEN,
  expiresRefreshTokenDays: env.EXPIRES_IN_REFRESH_TOKEN_DAYS,
}
