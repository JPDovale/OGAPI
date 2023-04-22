import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'

interface IRequest {
  userId: string
  personId: string
}

interface IResponse {
  person: IPerson
}

@injectable()
export class GetPersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute({ personId, userId }: IRequest): Promise<IResponse> {
    let Person: IPerson | null

    const personExistesInCache = await this.cacheProvider.getInfo<IResponse>(
      KeysRedis.person + personId,
    )

    if (!personExistesInCache) {
      const person = await this.personsRepository.findById(personId)
      if (!person) throw makeErrorPersonNotFound()

      await this.cacheProvider.setInfo<IResponse>(
        KeysRedis.person + personId,
        {
          person,
        },
        60 * 60, // 1hour
      )

      Person = person
    } else {
      Person = personExistesInCache.person
    }

    await this.verifyPermissions.verify({
      projectId: Person.project_id,
      userId,
      verifyPermissionTo: 'view',
    })

    return {
      person: Person,
    }
  }
}
