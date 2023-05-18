import { AppError } from '../AppError'

export function makeErrorTimeLineNotFound(): AppError {
  return new AppError({
    title: 'A linha de tempo não existe.',
    message: 'Parece que essa linha de tempo não existe na nossa base de dados',
    statusCode: 404,
  })
}
