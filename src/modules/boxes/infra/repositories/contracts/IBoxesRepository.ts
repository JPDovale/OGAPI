import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { type IUpdateBoxDTO } from '@modules/boxes/dtos/IUpdateBoxDTO'

import { type IBox } from '../entities/IBox'

export abstract class IBoxesRepository {
  abstract create(data: ICreateBoxDTO): Promise<IBox | null>
  abstract delete(boxId: string): Promise<void>
  abstract update(data: IUpdateBoxDTO): Promise<IBox | null>
  abstract findById(bokId: string): Promise<IBox | null>
  abstract listPerUser(userId: string): Promise<IBox[]>

  abstract listInternals(): Promise<IBox[]>
  abstract listAllNotInternal(): Promise<IBox[]>
}
