export interface IError {
  title: string
  message: string
  statusCode?: number
}
export class AppError {
  public readonly title: string
  public readonly message: string
  public readonly statusCode: number

  constructor({ title, message, statusCode }: IError) {
    this.title = title
    this.message = message
    this.statusCode = statusCode || 400
  }
}
