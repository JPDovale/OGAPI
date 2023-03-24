import { AppError } from '../AppError'

interface IMakeErrorNotFound {
  whatsNotFound: string
}

export function makeErrorNotFound({
  whatsNotFound,
}: IMakeErrorNotFound): AppError {
  return new AppError({
    title: `${whatsNotFound} não encontrado`,
    message: `${whatsNotFound} não existe na nossa base de dados`,
    statusCode: 404,
  })
}
