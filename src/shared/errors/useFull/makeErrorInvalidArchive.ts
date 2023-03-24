import { AppError } from '../AppError'

export function makeErrorInvalidArchive(): AppError {
  return new AppError({
    title: 'Tipo de arquivo invalido.',
    message: 'Tipo de arquivo invalido.',
    statusCode: 415,
  })
}
