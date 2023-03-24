import { AppError } from '../AppError'

export function makeErrorPersonNotCreated(): AppError {
  return new AppError({
    title: 'Error ao criar o personagem.',
    message:
      'Algo deu errado durante a criação do seu personagem. Entre em contato com a central de ajuda ou tente novamente mais tarde.',
    statusCode: 500,
  })
}
