export interface ISubObjectResponse {
  id: number
  infos: {
    title: string
    description: string
    createdAt: Date
  }
  collections: {
    personality?: string
    trauma?: string
    value?: string
  }
}
