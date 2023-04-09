import { AppError } from '../AppError'

export function makeValidationError(): AppError {
  return new AppError({
    title: 'Informações inválidas',
    message: 'Verifique as informações fornecidas e tente novamente',
  })
}
