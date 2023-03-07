import { inject, injectable } from 'tsyringe'

import { ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { Archive } from '@modules/boxes/infra/mongoose/entities/schemas/Archive'
import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

import { IBoxesControllers } from '../IBoxesControllers'
import { IControllerInternalBoxes } from '../types/IControllerInternalBoxes'

@injectable()
export class BoxesControllers implements IBoxesControllers {
  constructor(
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async controllerInternalBoxes({
    archive,
    name,
    projectId,
    projectName,
    userId,
    error,
    linkId,
    withoutArchive = false,
  }: IControllerInternalBoxes): Promise<IBox> {
    let boxExistes = await this.boxesRepository.findByNameAndProjectId({
      name,
      projectId,
    })

    if (!boxExistes) {
      const newBox: ICreateBoxDTO = {
        name,
        internal: true,
        userId,
        projectId,
        tags: [
          {
            name,
          },
          {
            name: projectName,
          },
        ],
      }

      const createdBox = await this.boxesRepository.create(newBox)

      boxExistes = createdBox
    }

    if (!withoutArchive) {
      const archiveExisteInArchives = boxExistes.archives.map(
        (a) => a.archive.title === archive.title,
      )

      if (archiveExisteInArchives) {
        throw new AppError({
          title: error.title,
          message: error.message,
          statusCode: 409,
        })
      }
    }

    const newArchive = new Archive({
      archive: {
        id: archive.id,
        title: archive.title,
        description: archive.description,
        createdAt: this.dateProvider.getDate(new Date()),
        updatedAt: this.dateProvider.getDate(new Date()),
      },
      links: [
        {
          id: linkId,
          type: 'id',
        },
      ],
    })

    const updatedBox = await this.boxesRepository.addArchive({
      archive: newArchive,
      id: boxExistes.id,
    })

    return updatedBox
  }
}
