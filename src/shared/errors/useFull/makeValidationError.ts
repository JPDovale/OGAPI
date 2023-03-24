import { AppError } from '../AppError'

export function makeValidationError(): AppError {
  return new AppError({
    title: 'Informações inválidas',
    message: 'Verefique as informações fornecidas e tente novamente',
  })
}
