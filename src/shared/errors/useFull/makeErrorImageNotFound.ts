import { AppError } from '../AppError'

export function makeErrorImageNotFound(): AppError {
  return new AppError({
    title: 'Imagem não encontrada.',
    message:
      'Parece que a imagem que você está tentando apagar não existe na nossa base de dados.',
    statusCode: 404,
  })
}
