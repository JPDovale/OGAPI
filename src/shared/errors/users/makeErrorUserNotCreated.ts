import { AppError } from '../AppError'

export function makeErrorUserNotCreated(): AppError {
  return new AppError({
    title: 'Error ao criar o usuário.',
    message:
      'Algo deu errado durante a criação do seu usuário. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
