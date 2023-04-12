import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IArchivesRepository } from '@modules/boxes/infra/repositories/contracts/IArchivesRepository'
import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { type IArchive } from '@modules/boxes/infra/repositories/entities/IArchive'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorBoxNotUpdate } from '@shared/errors/boxes/makeErrorBoxNotUpdate'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  boxId: string
  filesImages?: Array<{
    image_filename: string
    image_url: string
  }>
  title: string
  description: string
}

interface IResponse {
  archive: IArchive
}

@injectable()
export class CreateArchiveUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.ArchivesRepository)
    private readonly archivesRepository: IArchivesRepository,
  ) {}

  async execute({
    boxId,
    description,
    title,
    userId,
    filesImages,
  }: IRequest): Promise<IResponse> {
    const box = await this.boxesRepository.findById(boxId)
    const user = await this.usersRepository.findById(userId)

    if (!box) throw makeErrorBoxNotFound()
    if (!user) throw makeErrorUserNotFound()

    if (box.user_id !== userId) throw makeErrorDeniedPermission()

    const archivesInBox = box.archives?.length ?? 0

    if (archivesInBox >= 3 && !user.last_payment_date && !user.admin)
      throw makeErrorLimitFreeInEnd()

    const archive = await this.archivesRepository.create({
      title,
      description,
      box_id: box.id,
      gallery: {
        createMany: {
          data: filesImages ?? [],
        },
      },
    })

    if (!archive) throw makeErrorBoxNotUpdate()

    return { archive }
  }
}
