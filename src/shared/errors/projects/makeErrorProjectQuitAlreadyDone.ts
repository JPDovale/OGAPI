import { AppError } from '../AppError'

export function makeErrorProjectQuitAlreadyDone(): AppError {
  return new AppError({
    title: 'Você não está no projeto.',
    message: 'Você está tentanod sair de u projeto que você já saiu.',
  })
}
