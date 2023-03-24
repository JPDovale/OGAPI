import { AppError } from '../AppError'

export function makeErrorBookMaxGenresAdded(): AppError {
  return new AppError({
    title: 'O livre precisa ter pelo menos um gênero',
    message:
      'O livre precisa ter pelo menos um gênero para um controle maior da objetividade da sua escrita',
  })
}
