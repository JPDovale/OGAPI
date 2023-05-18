import { AppError } from '../AppError'

export function makeErrorTimeLineNotCreated(): AppError {
  return new AppError({
    title: 'Error ao criar a linha de tempo.',
    message:
      'Algo deu errado durante a criação da linha de tempo para o seu projeto. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
