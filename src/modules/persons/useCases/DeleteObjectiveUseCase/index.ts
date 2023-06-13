import { inject, injectable } from 'tsyringe'

import { IObjectivesRepository } from '@modules/persons/infra/repositories/contracts/IObjectivesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  objectiveId: string
}

@injectable()
export class DeleteObjectiveUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.ObjectivesRepository)
    private readonly objectivesRepository: IObjectivesRepository,
  ) {}

  async execute({
    objectiveId,
    personId,
    userId,
  }: IRequest): Promise<IResolve> {
    const person = await this.personsRepository.findById(personId)
    if (!person) {
      return {
        ok: false,
        error: makeErrorPersonNotFound(),
      }
    }

    const response = await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['persons'],
    })

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    const objectiveToRemovePerson = await this.objectivesRepository.findById(
      objectiveId,
    )

    if (!objectiveToRemovePerson) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Objetivo',
        }),
      }
    }

    const numbersOfPersonInObjective =
      objectiveToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInObjective <= 0) {
      await this.objectivesRepository.delete(objectiveId)
    } else {
      await this.objectivesRepository.removeOnePersonById({
        objectId: objectiveId,
        personId,
      })
    }

    return {
      ok: true,
    }
  }
}
