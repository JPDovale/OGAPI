import { AppError } from '../AppError'

export function makeErrorReorderValues(): AppError {
  return new AppError({
    title: 'Erro ao reordenar',
    message: 'Você enviou um valor maior que o aceito para reordenar.',
  })
}
