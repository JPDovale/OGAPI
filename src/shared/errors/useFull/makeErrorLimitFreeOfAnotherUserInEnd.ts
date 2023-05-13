import { AppError } from '../AppError'

export function makeErrorLimitFreeOfAnotherUserInEnd(): AppError {
  return new AppError({
    title: 'Limite atingido!',
    message:
      'Parece que o usuário que você está tentado adicionar atingiu o limite de para o plano free...',
  })
}
