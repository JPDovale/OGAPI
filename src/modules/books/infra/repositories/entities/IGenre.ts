import { type Genre } from '@prisma/client'

import { type IBook } from './IBook'

export interface IGenre extends Genre {
  books?: IBook[]
}
