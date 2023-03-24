import { AppError } from '../AppError'

export function makeErrorFileNotDeleted(): AppError {
  return new AppError({
    title: 'Error ao deletar o arquivo.',
    message:
      'Se estiver tendo problemas ao deletar os arquivos, por favor entre em contato com o nosso suporte.',
  })
}
