import { type ICreateArchiveDTO } from '@modules/boxes/dtos/ICreateArchiveDTO'
import { type IUpdateArchiveDTO } from '@modules/boxes/dtos/IUpdateArchiveDTO'

import { type IArchive } from '../entities/IArchive'

export abstract class IArchivesRepository {
  abstract create(data: ICreateArchiveDTO): Promise<IArchive | null>
  abstract findById(archiveId: string): Promise<IArchive | null>
  abstract delete(archiveId: string): Promise<void>
  abstract update(data: IUpdateArchiveDTO): Promise<IArchive | null>
}
