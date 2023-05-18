import { AppError } from '../AppError'

export function makeErrorProjectNotFound(): AppError {
  return new AppError({
    title: 'O projeto não existe.',
    message: 'Parece que esse projeto não existe na nossa base de dados',
    statusCode: 404,
  })
}
