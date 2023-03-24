import { AppError } from '../AppError'

export function makeErrorProjectAlreadyUnsharedWhitUser(): AppError {
  return new AppError({
    title: 'Esse usuário não tem acesso ao projeto...',
    message:
      'Você está tentando remover um usuário que não tem acesso ao projeto...',
  })
}
