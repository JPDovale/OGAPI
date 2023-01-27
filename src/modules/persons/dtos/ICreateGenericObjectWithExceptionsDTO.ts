export interface ICreateGenericObjectWithExceptionsDTO {
  title: string
  description: string
  exceptions?: Array<{ title?: string; description?: string }>
}
