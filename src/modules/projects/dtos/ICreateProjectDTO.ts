export interface ICreateProjectDTO {
  name: string
  createdPerUser: string
  type: 'book' | 'rpg' | 'roadMap' | 'gameplay'
  private: boolean
  password?: string
}
