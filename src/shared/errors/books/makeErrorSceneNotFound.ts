import { AppError } from '../AppError'

export function makeErrorSceneNotFound(): AppError {
  return new AppError({
    title: 'A cena não existe.',
    message: 'Parece que essa cena não existe na nossa base de dados',
    statusCode: 404,
  })
}
