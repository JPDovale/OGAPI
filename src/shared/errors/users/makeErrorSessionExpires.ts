import { AppError } from '../AppError'

export function makeErrorSessionExpires(): AppError {
  return new AppError({
    title: 'Sua seção expirou',
    message: 'Faça login novamente',
    statusCode: 401,
  })
}
