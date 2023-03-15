import { AppError } from '../AppError'

export function makeErrorCapituleNotFound(): AppError {
  return new AppError({
    title: 'O capitulo não existe.',
    message: 'Parece que esse capitulo não existe na nossa base de dados',
    statusCode: 404,
  })
}
