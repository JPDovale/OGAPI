import { AppError } from '../AppError'

export function makeErrorSubscriptionAlreadyExistsToUser(): AppError {
  return new AppError({
    title: 'Você já tem uma assinatura em aberto!',
    message:
      'Você já é assinante da nossa plataforma... Caso esteja querendo trocar de planos, abra a aba de configurações do usuário e cancele a sua inscrição atual',
    statusCode: 409,
  })
}
