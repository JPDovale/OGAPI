import { AppError } from '../AppError'

export function makeErrorAccessDenied(): AppError {
  return new AppError({
    title: 'Acesso negado!',
    message: 'Você não tem permissão para acessar ou alterar recurso.',
    statusCode: 401,
  })
}
