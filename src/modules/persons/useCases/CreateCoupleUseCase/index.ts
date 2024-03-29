import { inject, injectable } from 'tsyringe'

import { ICouplesRepository } from '@modules/persons/infra/repositories/contracts/ICouplesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type ICouple } from '@modules/persons/infra/repositories/entities/ICouple'
import { type ICoupleWithPerson } from '@modules/persons/infra/repositories/entities/ICoupleWithPerson'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { AppError } from '@shared/errors/AppError'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  description: string
  title: string
  untilEnd: boolean
  coupleId: string
}

interface IResponse {
  couple: ICouple
  coupleWithPerson: ICoupleWithPerson
}

@injectable()
export class CreateCoupleUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CouplesRepository)
    private readonly couplesRepository: ICouplesRepository,
  ) {}

  async execute({
    userId,
    personId,
    coupleId,
    description,
    untilEnd,
    title,
  }: IRequest): Promise<IResolve<IResponse>> {
    const person = await this.personsRepository.findById(personId)
    const personOfCouple = await this.personsRepository.findById(coupleId)

    if (!person || !personOfCouple) {
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

    const personsSameProject = person.project_id === personOfCouple.project_id

    if (!personsSameProject) {
      return {
        ok: false,
        error: new AppError({
          title: 'Error',
          message: 'The person can not reference person of different projects',
          statusCode: 409,
        }),
      }
    }

    const alreadyExisteCoupleWithPersonToPerson = person.couples?.find(
      (couple) => couple.coupleWithPerson?.person_id === coupleId,
    )

    if (alreadyExisteCoupleWithPersonToPerson) {
      return {
        ok: false,
        error: new AppError({
          title: 'Já existe uma casal relacionando esse personagens.',
          message:
            'Já existe uma casal relacionando esses personagens. Tente com outros personagens.',
        }),
      }
    }

    const couple = await this.couplesRepository.create({
      title,
      description,
      person: {
        connect: {
          id: personId,
        },
      },
      until_end: untilEnd,
      coupleWithPerson: {
        create: {
          person: {
            connect: {
              id: personOfCouple.id,
            },
          },
        },
      },
    })

    if (!couple) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }
    if (!couple.coupleWithPerson) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: { couple, coupleWithPerson: couple.coupleWithPerson },
    }
  }
}
