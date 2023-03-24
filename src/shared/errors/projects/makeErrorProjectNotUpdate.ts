import { AppError } from '../AppError'

export function makeErrorProjectNotUpdate(): AppError {
  return new AppError({
    title: 'Erro ao atualizar o projeto.',
    message:
      'Algo deu errado durante a atualização do seu projeto. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
