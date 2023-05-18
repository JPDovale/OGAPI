import { AppError } from '../AppError'

export function makeErrorTimeLineNeedConfigurations(): AppError {
  return new AppError({
    statusCode: 409,
    title: 'Configurações ausentes',
    message:
      "Você está usando o modelo 'Time lines', porem você ainda não configurou a data em que a história se passa... Acesse configurações e defina a data para continuar",
  })
}
