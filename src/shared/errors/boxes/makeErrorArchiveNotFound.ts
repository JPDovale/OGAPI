import { AppError } from '../AppError'

export function makeErrorArchiveNotFound(): AppError {
  return new AppError({
    title: 'O arquivo não existe na box.',
    message: 'Parece que esse arquivo não existe na nossa base de dados',
    statusCode: 404,
  })
}
