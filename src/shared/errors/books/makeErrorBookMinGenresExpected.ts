import { AppError } from '../AppError'

export function makeErrorBookMinGenresExpected(): AppError {
  return new AppError({
    title: 'Adicione apenas 6 gêneros',
    message:
      'Adicione apenas 6 gêneros para um controle maior da objetividade da sua escrita',
  })
}
