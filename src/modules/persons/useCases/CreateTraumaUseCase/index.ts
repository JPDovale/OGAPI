import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ITraumasRepository } from '@modules/persons/infra/repositories/contracts/ITraumasRepository'
import { type ITrauma } from '@modules/persons/infra/repositories/entities/ITrauma'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'

interface IRequest {
  userId: string
  personId: string
  title: string
  description: string
  consequences?: Array<{
    title: string
    description: string
  }>
}

interface IResponse {
  trauma: ITrauma
}

@injectable()
export class CreateTraumaUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.TraumasRepository)
    private readonly traumasRepository: ITraumasRepository,
  ) {}

  async execute({
    personId,
    userId,
    description,
    title,
    consequences,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const traumaExistesToThiPerson = person.traumas?.find(
      (trauma) =>
        trauma.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )
    if (traumaExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um trauma',
      })

    const trauma = await this.traumasRepository.create({
      title,
      description,
      consequences: {
        createMany: {
          data: consequences ?? [],
        },
      },
      persons: {
        connect: {
          id: person.id,
        },
      },
    })

    if (!trauma) throw makeErrorPersonNotUpdate()

    return { trauma }
  }
}
