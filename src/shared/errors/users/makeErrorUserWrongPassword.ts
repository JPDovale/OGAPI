import { AppError } from '../AppError'

export function makeErrorUserWrongPassword(): AppError {
  return new AppError({
    title: 'Senha invalida.',
    message:
      'Senha invalida, coso tenha esquecido a senha, faça o logout e acesse "esqueci a minha senha".',
  })
}
