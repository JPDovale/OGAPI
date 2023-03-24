import { AppError } from '../AppError'

export function makeErrorBoxNotUpdate(): AppError {
  return new AppError({
    title: 'Erro ao atualizar a box.',
    message:
      'Algo deu errado durante a atualização da sua box. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
