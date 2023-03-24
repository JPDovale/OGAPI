import { AppError } from '../AppError'

export function makeErrorBoxNotCreated(): AppError {
  return new AppError({
    title: 'Error ao criar a box.',
    message:
      'Algo deu errado durante a criação da sua box. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
