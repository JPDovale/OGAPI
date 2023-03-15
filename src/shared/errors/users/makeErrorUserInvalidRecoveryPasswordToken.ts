import { AppError } from '../AppError'

export function makeErrorUserInvalidRecoveryPasswordToken(): AppError {
  return new AppError({
    title: 'Token inválido ou expirado.',
    message:
      'Seu token de recuperação de senha é inválido ou está expirado. Tente pedir outro email de recuperação.',
  })
}
