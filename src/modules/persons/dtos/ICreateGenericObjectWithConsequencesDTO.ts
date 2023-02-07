export interface ICreateGenericObjectWithConsequencesDTO {
  title: string
  description: string
  consequences?: Array<{ title?: string; description?: string }>
}
