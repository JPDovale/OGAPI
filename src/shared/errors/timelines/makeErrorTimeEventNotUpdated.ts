import { AppError } from '../AppError'

export function makeErrorTimeEventNotUpdated(): AppError {
  return new AppError({
    title: 'Houve um error ao atualizar o evento.',
    message:
      'Algo deu errado durante a atualização do seu evento. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
