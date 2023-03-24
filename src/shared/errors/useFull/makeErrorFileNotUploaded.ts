import { AppError } from '../AppError'

export function makeErrorFileNotUploaded(): AppError {
  return new AppError({
    title: 'Error ao fazer upload do arquivo.',
    message:
      'Se estiver tendo problemas com o upload de arquivos, por favor entre em contato com o nosso suporte.',
  })
}
