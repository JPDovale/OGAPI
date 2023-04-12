import { type ICreateImageDTO } from '@modules/boxes/dtos/ICreateImageDTO'
import { prisma } from '@shared/infra/database/createConnection'

import { type IImagesRepository } from '../../repositories/contracts/IImagesRepository'
import { type IImage } from '../../repositories/entities/IImage'

export class ImagesPrismaRepository implements IImagesRepository {
  async delete(imageId: string): Promise<void> {
    await prisma.image.delete({
      where: {
        id: imageId,
      },
    })
  }

  async findById(imageId: string): Promise<IImage | null> {
    const image = await prisma.image.findUnique({
      where: {
        id: imageId,
      },
    })

    return image
  }

  async create(data: ICreateImageDTO): Promise<IImage | null> {
    const image = await prisma.image.create({
      data,
    })

    return image
  }
}
