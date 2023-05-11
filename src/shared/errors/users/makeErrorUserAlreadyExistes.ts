import { AppError } from '../AppError'

export function makeErrorUserAlreadyExistes(): AppError {
  return new AppError({
    title: 'O usuário já existe.',
    message: 'Localizamos um usuário já cadastrado com esse e-mail.',
    statusCode: 409,
  })
}
