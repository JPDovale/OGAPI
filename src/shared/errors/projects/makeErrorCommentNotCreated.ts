import { AppError } from '../AppError'

export function makeErrorCommentNotCreated(): AppError {
  return new AppError({
    title: 'Erro ao comentar...',
    message:
      'Houve um erro durante a criação do seu comentário. Contate o nosso suporte ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
