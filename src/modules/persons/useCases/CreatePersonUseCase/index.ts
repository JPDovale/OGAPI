import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotCreated } from '@shared/errors/persons/makeErrorPersonNotCreated'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'

interface IRequest {
  userId: string
  projectId: string
  name: string
  lastName: string
  history: string
  age: number
}

interface IResponse {
  person: IPerson
}

@injectable()
export class CreatePersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    userId,
    projectId,
    age,
    history,
    lastName,
    name,
  }: IRequest): Promise<IResponse> {
    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const numberOfPersonsInProject = project._count?.persons ?? 0

    if (
      numberOfPersonsInProject >= 15 &&
      !user.last_payment_date &&
      !user.admin
    )
      throw makeErrorLimitFreeInEnd()

    const person = await this.personsRepository.create({
      age,
      history,
      last_name: lastName,
      name,
      project_id: project.id,
      user_id: user.id,
    })

    if (!person) throw makeErrorPersonNotCreated()

    return { person }
  }
}
