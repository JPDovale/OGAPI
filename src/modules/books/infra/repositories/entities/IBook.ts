import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Book } from '@prisma/client'

import { type IAuthor } from './IAuthor'
import { type ICapitule } from './ICapitule'
import { type IGenre } from './IGenre'

export interface IBook extends Book {
  genres?: IGenre[]
  authors?: IAuthor[]
  capitules?: ICapitule[]
  comments?: IComment[]
}
