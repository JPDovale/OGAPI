import { AppError } from '../AppError'

export function makeErrorPersonNotFound(): AppError {
  return new AppError({
    title: 'O personagem não existe.',
    message: 'Parece que esse personagem não existe na nossa base de dados',
    statusCode: 404,
  })
}
