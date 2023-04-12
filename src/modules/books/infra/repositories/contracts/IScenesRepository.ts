import { type ICreateSceneDTO } from '@modules/books/dtos/ICreateSceneDTO'
import { type IUpdateManyScenesDTO } from '@modules/books/dtos/IUpdateManyScenesDTO'
import { type IUpdateSceneDTO } from '@modules/books/dtos/IUpdateSceneDTO'

import { type IScene } from '../entities/IScene'

export abstract class IScenesRepository {
  abstract create(data: ICreateSceneDTO): Promise<IScene | null>
  abstract findById(sceneId: string): Promise<IScene | null>
  abstract updateMany(data: IUpdateManyScenesDTO): Promise<void>
  abstract update(data: IUpdateSceneDTO): Promise<IScene | null>
}
