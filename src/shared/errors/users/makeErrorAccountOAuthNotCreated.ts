import { AppError } from '../AppError'

export function makeErrorAccountOAuthNotCreated(): AppError {
  return new AppError({
    title: 'Error ao criar a sua seção.',
    message:
      'Algo deu errado durante a criação da sua seção. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
