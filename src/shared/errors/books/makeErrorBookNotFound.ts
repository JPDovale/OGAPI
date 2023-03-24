import { AppError } from '../AppError'

export function makeErrorBookNotFound(): AppError {
  return new AppError({
    title: 'O livro não existe.',
    message: 'Parece que esse livro não existe na nossa base de dados',
    statusCode: 404,
  })
}
