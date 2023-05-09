import { type ICreateArchiveDTO } from '@modules/boxes/dtos/ICreateArchiveDTO'
import { type IUpdateArchiveDTO } from '@modules/boxes/dtos/IUpdateArchiveDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type IArchivesRepository } from '../../repositories/contracts/IArchivesRepository'
import { type IArchive } from '../../repositories/entities/IArchive'

export class ArchivesPrismaRepository implements IArchivesRepository {
  async create(data: ICreateArchiveDTO): Promise<IArchive | null> {
    const archive = await prisma.archive.create({
      data,
      include: {
        gallery: true,
      },
    })

    return archive
  }

  async findById(archiveId: string): Promise<IArchive | null> {
    const archive = await prisma.archive.findUnique({
      where: {
        id: archiveId,
      },
      include: {
        gallery: true,
      },
    })

    return archive
  }

  async delete(archiveId: string): Promise<void> {
    await prisma.archive.delete({
      where: {
        id: archiveId,
      },
    })
  }

  async update({
    archiveId,
    data,
  }: IUpdateArchiveDTO): Promise<IArchive | null> {
    const archive = await prisma.archive.update({
      where: {
        id: archiveId,
      },
      data,
      include: {
        gallery: true,
      },
    })

    return archive
  }
}
