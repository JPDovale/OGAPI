import { AppError } from '../AppError'

export function makeErrorTimeEventNotCreated(): AppError {
  return new AppError({
    title: 'Houve um error ao criar o evento.',
    message:
      'Algo deu errado durante a criação do seu evento. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
