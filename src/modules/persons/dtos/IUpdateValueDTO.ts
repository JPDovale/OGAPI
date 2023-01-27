export interface IUpdateValueDTO {
  title?: string
  description?: string
  exceptions?: Array<{ title?: string; description?: string }>
}
