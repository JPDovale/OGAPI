import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { type IBox } from '@modules/boxes/infra/repositories/entities/IBox'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorBoxNotUpdate } from '@shared/errors/boxes/makeErrorBoxNotUpdate'
import { makeErrorAccessDenied } from '@shared/errors/useFull/makeErrorAccessDenied'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  boxId: string
  name?: string
  description?: string
  userId: string
}

interface IResponse {
  box: IBox
}

@injectable()
export class UpdateBoxUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    boxId,
    name,
    description,
    userId,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    if (box.user_id !== user.id) throw makeErrorAccessDenied()

    if (!name && !description) return { box }

    const updatedBox = await this.boxesRepository.update({
      boxId,
      data: {
        name,
        description,
      },
    })

    if (!updatedBox) throw makeErrorBoxNotUpdate()

    return { box: updatedBox }
  }
}
