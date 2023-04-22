import { inject, injectable } from 'tsyringe'

import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { type IBox } from '@modules/boxes/infra/repositories/entities/IBox'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import InjectableDependencies from '@shared/container/types'

interface IRequest {
  userId: string
}

interface IResponse {
  boxes: IBox[]
}

@injectable()
export class GetBoxesUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    let Boxes: IBox[]

    const boxesExistesInCache = await this.cacheProvider.getInfo<IResponse>(
      KeysRedis.boxes + userId,
    )

    if (!boxesExistesInCache) {
      const boxes = await this.boxesRepository.listPerUser(userId)
      if (!boxes[0]) {
        return {
          boxes: [],
        }
      }

      await this.cacheProvider.setInfo<IResponse>(
        KeysRedis.boxes + userId,
        {
          boxes,
        },

        60 * 30,
      )

      Boxes = boxes
    } else {
      Boxes = boxesExistesInCache.boxes
    }

    return {
      boxes: Boxes,
    }
  }
}
