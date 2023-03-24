import { AppError } from '../AppError'

export function makeErrorPersonNotUpdate(): AppError {
  return new AppError({
    title: 'Erro ao atualizar o personagem.',
    message:
      'Algo deu errado durante a atualização do seu personagem. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
