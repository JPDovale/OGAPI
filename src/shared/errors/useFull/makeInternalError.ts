import { AppError } from '../AppError'

export function makeInternalError(): AppError {
  return new AppError({
    title: 'Internal errror.',
    message: 'Internal error',
    statusCode: 500,
  })
}
