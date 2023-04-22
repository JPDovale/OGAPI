export interface IPersonPreview {
  id: string
  name: string
  last_name: string
  age: number
  created_at: Date
  updated_at: Date
  image_url: string
  history: string
  _count: {
    objectives: number
    dreams: number
    fears: number
    couples: number
    appearances: number
    personalities: number
    powers: number
    traumas: number
    values: number
    wishes: number
  }
}
