import { AppError } from '../AppError'

export function makeErrorProjectNotCreated(): AppError {
  return new AppError({
    title: 'Error ao criar o projeto.',
    message:
      'Algo deu errado durante a criação do seu projeto. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
