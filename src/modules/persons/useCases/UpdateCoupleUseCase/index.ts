import { inject, injectable } from 'tsyringe'

import { ICouplesRepository } from '@modules/persons/infra/repositories/contracts/ICouplesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type ICouple } from '@modules/persons/infra/repositories/entities/ICouple'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  coupleId: string
  title?: string
  description?: string
  untilEnd?: boolean
}

interface IResponse {
  couple: ICouple
}

@injectable()
export class UpdateCoupleUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CouplesRepository)
    private readonly couplesRepository: ICouplesRepository,
  ) {}

  async execute({
    coupleId,
    personId,
    userId,
    description,
    title,
    untilEnd,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const coupleToUpdate = await this.couplesRepository.findById(coupleId)

    if (!coupleToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Casal',
      })
    }

    const updatedCouple = await this.couplesRepository.update({
      coupleId,
      data: {
        title,
        description,
        until_end: untilEnd,
      },
    })

    if (!updatedCouple) throw makeErrorPersonNotUpdate()

    return { couple: updatedCouple }
  }
}
