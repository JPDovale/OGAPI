import { AppError } from '../AppError'

export function makeErrorDeniedPermission(): AppError {
  return new AppError({
    title: 'Acesso negado.',
    message: 'Você não tem acesso a essa funcionalidade.',
    statusCode: 401,
  })
}
