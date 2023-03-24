import { AppError } from '../AppError'

export function makeErrorProjectQuitPerCreator(): AppError {
  return new AppError({
    title: 'Você não pode sair do projeto',
    message:
      'Você esta tentando sair de um projeto o qual você criou... Tente exclui-lo',
  })
}
