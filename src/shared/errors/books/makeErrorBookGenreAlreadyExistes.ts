import { AppError } from '../AppError'

export function makeErrorBookGenreAlreadyExistes(): AppError {
  return new AppError({
    title: 'Esse gênero já existe',
    message: 'Esse gênero já existe nesse livro, tente adicionar outro',
  })
}
