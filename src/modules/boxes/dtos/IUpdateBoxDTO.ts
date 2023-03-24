export interface IUpdateBoxDTO {
  id: string
  name: string
  description: string
  tags: Array<{
    name: string
  }>
}
