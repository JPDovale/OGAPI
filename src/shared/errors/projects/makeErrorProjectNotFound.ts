import { AppError } from '../AppError'

export function makeErrorProjectNotFound(): AppError {
  return new AppError({
    title: 'O livro não existe.',
    message: 'Parece que esse livro não existe na nossa base de dados',
    statusCode: 404,
  })
}
