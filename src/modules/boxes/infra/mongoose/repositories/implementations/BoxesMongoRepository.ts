import { injectable } from 'tsyringe'

import { type IUpdateBoxDTO } from '@modules/boxes/dtos/IUpdateBoxDTO'
import { type IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { type IBox } from '@modules/boxes/infra/repositories/entities/IBox'
import { type Prisma } from '@prisma/client'

import { BoxMongo } from '../../entities/schemas/Box'

@injectable()
export class BoxesMongoRepository implements IBoxesRepository {
  async findById(bokId: string): Promise<IBox | null> {
    throw new Error('Method not implemented.')
  }

  async create(data: Prisma.BoxUncheckedCreateInput): Promise<IBox | null> {
    throw new Error('Method not implemented.')
  }

  async delete(boxId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async update(data: IUpdateBoxDTO): Promise<IBox | null> {
    throw new Error('Method not implemented.')
  }

  async listInternals(): Promise<IBox[]> {
    const boxes = await BoxMongo.find({
      internal: true,
    })

    return boxes as unknown as IBox[]
  }

  async listAllNotInternal(): Promise<IBox[]> {
    const boxes = await BoxMongo.find({
      internal: false,
    })

    return boxes as unknown as IBox[]
  }
}
