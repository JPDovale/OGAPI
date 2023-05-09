import { type ICreateImageDTO } from '@modules/boxes/dtos/ICreateImageDTO'

import { type IImage } from '../entities/IImage'

export abstract class IImagesRepository {
  abstract delete(imageId: string): Promise<void>
  abstract findById(imageId: string): Promise<IImage | null>
  abstract create(data: ICreateImageDTO): Promise<IImage | null>
}
