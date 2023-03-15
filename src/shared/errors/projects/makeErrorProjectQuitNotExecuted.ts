import { AppError } from '../AppError'

export function makeErrorProjectQuitNotExecuted(): AppError {
  return new AppError({
    title: 'Erro ao sair do projeto.',
    message:
      'Ocoreu um erro enquanto você tantava sair do projeto. Por favor entre em contato com o suporte ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
