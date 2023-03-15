import { AppError } from '../AppError'

export function makeErrorBookNotCreated(): AppError {
  return new AppError({
    title: 'Error ao criar o livro.',
    message:
      'Algo deu errado durante a criação do seu livro. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
