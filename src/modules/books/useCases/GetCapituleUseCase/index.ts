import { inject, injectable } from 'tsyringe'

import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'

interface IRequest {
  userId: string
  capituleId: string
}

interface IResponse {
  capitule: ICapitule
}

@injectable()
export class GetCapituleUseCase {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,

    @inject(InjectableDependencies.Repositories.CapitulesRepository)
    private readonly capitulesRepository: ICapitulesRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ capituleId, userId }: IRequest): Promise<IResponse> {
    let Capitule: ICapitule | null

    const capituleExistesInCache = await this.cacheProvider.getInfo<IResponse>(
      KeysRedis.capitule + capituleId,
    )

    if (!capituleExistesInCache) {
      const capitule = await this.capitulesRepository.findById(capituleId)
      if (!capitule) throw makeErrorCapituleNotFound()

      await this.cacheProvider.setInfo<IResponse>(
        KeysRedis.capitule + capituleId,
        {
          capitule,
        },
        60 * 60, // 1 hour
      )

      Capitule = capitule
    } else {
      Capitule = capituleExistesInCache.capitule
    }

    await this.verifyPermissions.verify({
      projectId: Capitule.book!.project_id,
      userId,
      verifyPermissionTo: 'view',
    })

    return {
      capitule: Capitule,
    }
  }
}
