import { type ICreateCapituleDTO } from '@modules/books/dtos/ICreateCapituleDTO'
import { type IUpdateCapituleDTO } from '@modules/books/dtos/IUpdateCapituleDTO'
import { type IUpdateManyCapitulesDTO } from '@modules/books/dtos/IUpdateManyCapitulesDTO'

import { type ICapitule } from '../entities/ICapitule'
import { type IScene } from '../entities/IScene'

export abstract class ICapitulesRepository {
  abstract create(data: ICreateCapituleDTO): Promise<ICapitule | null>
  abstract findById(capituleId: string): Promise<ICapitule | null>
  abstract delete(capituleId: string): Promise<void>
  abstract updateMany(data: IUpdateManyCapitulesDTO): Promise<void>
  abstract update(data: IUpdateCapituleDTO): Promise<ICapitule | null>
  abstract listScenes(capituleId: string): Promise<IScene[]>
}
