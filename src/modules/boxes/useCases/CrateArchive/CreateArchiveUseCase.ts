import { inject, injectable } from 'tsyringe'

import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { Archive } from '@modules/boxes/infra/mongoose/entities/schemas/Archive'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorBoxNotUpdate } from '@shared/errors/boxes/makeErrorBoxNotUpdate'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  boxId: string
  filesImages?: IAvatar[]
  title: string
  description: string
}

interface IResponse {
  box: IBox
}

@injectable()
export class CreateArchiveUseCase {
  constructor(
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
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
    if (box.userId !== userId) throw makeErrorDeniedPermission()
    if (box.archives.length >= 5 && !user.payed) throw makeErrorLimitFreeInEnd()

    const archive = new Archive({
      archive: {
        title,
        description,
      },
      images: filesImages,
    })

    const updatedBox = await this.boxesRepository.addArchive({
      archive,
      id: box.id,
    })

    if (!updatedBox) throw makeErrorBoxNotUpdate()

    return { box: updatedBox }
  }
}
