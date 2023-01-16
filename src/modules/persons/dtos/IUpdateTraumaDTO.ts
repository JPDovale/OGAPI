export interface IUpdateTraumaDTO {
  title?: string
  description?: string
  consequences?: Array<{
    title: string
    description: string
  }>
}
