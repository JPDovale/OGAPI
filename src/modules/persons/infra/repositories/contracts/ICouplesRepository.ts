import { type ICreateCoupleDTO } from '@modules/persons/dtos/ICreateCoupleDTO'
import { type IUpdateCoupleDTO } from '@modules/persons/dtos/IUpdateCoupleDTO'

import { type ICouple } from '../entities/ICouple'

export abstract class ICouplesRepository {
  abstract create(data: ICreateCoupleDTO): Promise<ICouple | null>
  abstract delete(coupleId: string): Promise<void>
  abstract findById(coupleId: string): Promise<ICouple | null>
  abstract update(data: IUpdateCoupleDTO): Promise<ICouple | null>
}
