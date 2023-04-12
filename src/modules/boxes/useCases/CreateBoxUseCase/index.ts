import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { type IBox } from '@modules/boxes/infra/repositories/entities/IBox'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBoxNotCreated } from '@shared/errors/boxes/makeErrorBoxNotCreated'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  name: string
  description?: string
  tags?: Array<{
    name: string
  }>
}

interface IResponse {
  box: IBox
}

@injectable()
export class CreateBoxUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    name,
    tags,
    userId,
    description,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const numberBoxesOfUser = user._count?.boxes ?? 0

    if (numberBoxesOfUser >= 1 && !user.last_payment_date && !user.admin)
      throw makeErrorLimitFreeInEnd()

    const box = await this.boxesRepository.create({
      name,
      user_id: user.id,
      description,
      tags: {
        createMany: {
          data: tags ?? [],
        },
      },
    })

    if (!box) throw makeErrorBoxNotCreated()

    return { box }
  }
}
