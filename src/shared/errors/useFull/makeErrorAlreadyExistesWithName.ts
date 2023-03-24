import { AppError } from '../AppError'

interface IMakeErrorAlreadyExistesWithName {
  whatExistes: string
}

export function makeErrorAlreadyExistesWithName({
  whatExistes,
}: IMakeErrorAlreadyExistesWithName): AppError {
  return new AppError({
    title: `Já existe ${whatExistes} com esse nome`,
    message: `Já existe ${whatExistes} com esse nome. Por favor tente outro nome...`,
  })
}
