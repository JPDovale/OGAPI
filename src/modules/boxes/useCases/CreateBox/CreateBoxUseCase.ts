import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
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
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
  ) {}

  async execute({
    name,
    tags,
    userId,
    description,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()

    const registersNotInternalThisUser =
      await this.boxesRepository.numberOfBoxesNotInternalByUserId(userId)

    if (registersNotInternalThisUser >= 3 && !user.payed)
      throw makeErrorLimitFreeInEnd()

    const newBox: ICreateBoxDTO = {
      name,
      description: description ?? '',
      tags: tags ?? [],
      userId,
      internal: false,
      type: 'default',
    }

    const box = await this.boxesRepository.create(newBox)

    if (!box) throw makeErrorBoxNotCreated()

    return { box }
  }
}
