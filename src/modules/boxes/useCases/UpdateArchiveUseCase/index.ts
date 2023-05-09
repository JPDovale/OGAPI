import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IArchivesRepository } from '@modules/boxes/infra/repositories/contracts/IArchivesRepository'
import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { type IArchive } from '@modules/boxes/infra/repositories/entities/IArchive'
import InjectableDependencies from '@shared/container/types'
import { makeErrorArchiveNotFound } from '@shared/errors/boxes/makeErrorArchiveNotFound'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorBoxNotUpdate } from '@shared/errors/boxes/makeErrorBoxNotUpdate'
import { makeErrorAccessDenied } from '@shared/errors/useFull/makeErrorAccessDenied'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  boxId: string
  archiveId: string
  userId: string
  title?: string
  description?: string
}

interface IResponse {
  archive: IArchive
}

@injectable()
export class UpdateArchiveUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.ArchivesRepository)
    private readonly archivesRepository: IArchivesRepository,
  ) {}

  async execute({
    archiveId,
    boxId,
    description,
    title,
    userId,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    if (box.user_id !== user.id) throw makeErrorAccessDenied()

    const archive = await this.archivesRepository.findById(archiveId)
    if (!archive) throw makeErrorArchiveNotFound()

    if (!title && !description) return { archive }

    const archiveUpdated = await this.archivesRepository.update({
      archiveId,
      data: {
        title,
        description,
      },
    })

    if (!archiveUpdated) throw makeErrorBoxNotUpdate()

    return { archive: archiveUpdated }
  }
}
