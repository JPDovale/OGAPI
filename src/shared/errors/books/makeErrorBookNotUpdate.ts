import { AppError } from '../AppError'

export function makeErrorBookNotUpdate(): AppError {
  return new AppError({
    title: 'Erro ao atualizar o livro.',
    message:
      'Algo deu errado durante a atualização do seu livro. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
