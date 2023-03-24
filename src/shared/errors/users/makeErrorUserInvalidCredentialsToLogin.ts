import { AppError } from '../AppError'

export function makeErrorUserInvalidCredentialsToLogin(): AppError {
  return new AppError({
    title: 'Email ou senha incorretos.',
    message:
      'O email ou a senha que você informou são inválidos. Verifique as informações e tente de novo.',
  })
}
