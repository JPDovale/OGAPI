import { inject, injectable } from 'tsyringe'

import { type IArchive } from '@modules/boxes/infra/mongoose/entities/types/IArchive'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { makeErrorArchiveNotFound } from '@shared/errors/boxes/makeErrorArchiveNotFound'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorBoxNotUpdate } from '@shared/errors/boxes/makeErrorBoxNotUpdate'

interface IRequest {
  boxId: string
  archiveId: string
  title?: string
  description?: string
}

interface IResponse {
  box: IBox
}

@injectable()
export class UpdateArchiveUseCase {
  constructor(
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({
    archiveId,
    boxId,
    description,
    title,
  }: IRequest): Promise<IResponse> {
    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    const archive = box.archives.find((a) => a.archive.id === archiveId)
    const filteredArchives = box.archives.filter(
      (a) => a.archive.id !== archiveId,
    )
    if (!archive) throw makeErrorArchiveNotFound()
    if (!title && !description) return { box }

    const archiveUpdated: IArchive = {
      ...archive,
      archive: {
        ...archive.archive,
        title: title ?? archive.archive.title,
        description: description ?? archive.archive.description,
        updatedAt: this.dateProvider.getDate(new Date()),
      },
    }

    const updatedArchive: IArchive[] = [...filteredArchives, archiveUpdated]

    const updatedBox = await this.boxesRepository.updateArchives({
      id: box.id,
      archives: updatedArchive,
    })
    if (!updatedBox) throw makeErrorBoxNotUpdate()

    return { box: updatedBox }
  }
}
