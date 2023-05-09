import { type Archive } from '@prisma/client'

import { type IImage } from './IImage'

export interface IArchive extends Archive {
  gallery?: IImage[]
}
