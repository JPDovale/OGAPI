import { type IPersonInObject } from './IPersonInObject'

export interface IInCouplePerson extends IPersonInObject {
  age: number | null
  history: string
}
