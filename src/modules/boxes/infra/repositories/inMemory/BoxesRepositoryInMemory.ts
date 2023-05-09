import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { type IUpdateBoxDTO } from '@modules/boxes/dtos/IUpdateBoxDTO'

import { type IBoxesRepository } from '../contracts/IBoxesRepository'
import { type IBox } from '../entities/IBox'

export class BoxesRepositoryInMemory implements IBoxesRepository {
  boxes: IBox[] = []

  async create(data: ICreateBoxDTO): Promise<IBox | null> {
    throw new Error('Method not implemented.')
  }

  async delete(boxId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async update(data: IUpdateBoxDTO): Promise<IBox | null> {
    throw new Error('Method not implemented.')
  }

  async findById(bokId: string): Promise<IBox | null> {
    throw new Error('Method not implemented.')
  }

  async listInternals(): Promise<IBox[]> {
    throw new Error('Method not implemented.')
  }

  async listAllNotInternal(): Promise<IBox[]> {
    throw new Error('Method not implemented.')
  }
}
