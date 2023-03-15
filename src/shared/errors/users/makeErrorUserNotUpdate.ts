import { AppError } from '../AppError'

export function makeErrorUserNotUpdate(): AppError {
  return new AppError({
    title: 'Erro ao atualizar o usuário.',
    message:
      'Algo deu errado durante a atualização do seu perfil. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
