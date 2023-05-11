import { AppError } from '../AppError'

export function makeErrorProjectAlreadySharedWithUser(): AppError {
  return new AppError({
    title: 'Esse usuário já tem acesso ao projeto...',
    message:
      'Você está tentando adicionar um usuário que já tem acesso ao projeto... Caso queira alterar a permissão, vá até as configurações do projeto.',
  })
}
