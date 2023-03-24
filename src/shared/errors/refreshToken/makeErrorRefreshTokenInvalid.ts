import { AppError } from '../AppError'

export function makeErrorRefreshTokenInvalid(): AppError {
  return new AppError({
    title: 'Invalid token',
    message: 'Invalid token',
  })
}
