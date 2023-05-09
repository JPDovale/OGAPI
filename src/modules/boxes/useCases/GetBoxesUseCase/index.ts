import { inject, injectable } from 'tsyringe'

import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { type IBox } from '@modules/boxes/infra/repositories/entities/IBox'
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
  ) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const boxes = await this.boxesRepository.listPerUser(userId)
    if (!boxes[0]) {
      return {
        boxes: [],
      }
    }

    return {
      boxes,
    }
  }
}
