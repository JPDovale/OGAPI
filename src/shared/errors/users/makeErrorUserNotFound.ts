import { AppError } from '../AppError'

export function makeErrorUserNotFound(): AppError {
  return new AppError({
    title: 'Usuário não encontrado.',
    message: 'Parece que esse usuário não existe na nossa base de dados...',
    statusCode: 404,
  })
}
