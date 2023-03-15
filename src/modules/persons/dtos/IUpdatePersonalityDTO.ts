export interface IUpdatePersonalityDTO {
  title?: string
  description?: string
  consequences?: Array<{
    title: string
    description: string
  }>
}
