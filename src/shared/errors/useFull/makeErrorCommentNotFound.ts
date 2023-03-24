import { AppError } from '../AppError'

export function makeErrorCommentNotFound(): AppError {
  return new AppError({
    title: 'Comentário não encontrado',
    message: 'Parece que esse comentário não existe na nossa base de dados.',
  })
}
