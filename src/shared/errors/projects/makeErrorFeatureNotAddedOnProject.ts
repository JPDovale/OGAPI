import { AppError } from '../AppError'

export function makeErrorFeatureNotAddedOnProject(): AppError {
  return new AppError({
    title: 'Modelo não adicionado ao projeto',
    message:
      'Parece que você não adicionou o modelo que está tentando altear no projeto ainda',
    statusCode: 400,
  })
}
