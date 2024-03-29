import { AppError } from '../AppError'

export function makeErrorLimitFreeInEnd(): AppError {
  return new AppError({
    title: 'Limite atingido!',
    message:
      'Parece que você atingiu o limite de criação para o plano free... Que tal tentar o nosso plano premium?',
  })
}
