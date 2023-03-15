import { type ICapitule } from '../../entities/types/ICapitule'

export interface IUpdateCapitules {
  capitules: ICapitule[]
  writtenWords: string
  id: string
}
