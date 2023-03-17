import { AppError } from '../AppError'

export function makeErrorBoxNotFound(): AppError {
  return new AppError({
    title: 'A box não existe.',
    message: 'Parece que essa box não existe na nossa base de dados',
    statusCode: 404,
  })
}
