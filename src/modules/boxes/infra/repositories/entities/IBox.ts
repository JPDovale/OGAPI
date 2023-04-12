import { type Box } from '@prisma/client'

import { type IArchive } from './IArchive'
import { type ITag } from './ITag'

export interface IBox extends Box {
  tags?: ITag[]
  archives?: IArchive[]
}
