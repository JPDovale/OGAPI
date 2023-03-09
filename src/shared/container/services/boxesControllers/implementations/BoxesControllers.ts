import { inject, injectable } from 'tsyringe'

import { ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { Archive } from '@modules/boxes/infra/mongoose/entities/schemas/Archive'
import { IArchive } from '@modules/boxes/infra/mongoose/entities/types/IArchive'
import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

import { IBoxesControllers } from '../IBoxesControllers'
import { IControllerInternalBoxes } from '../types/IControllerInternalBoxes'
import { ILinkObject } from '../types/ILinkObject'
import { ILinkObjectResponse } from '../types/ILinkObjectResponse'
import { IUnlinkObject } from '../types/IUnlinkObject'

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
      const archiveExisteInArchives = boxExistes.archives.find(
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

  async unlinkObject({
    archiveId,
    boxName,
    objectToUnlinkId,
    projectId,
    withoutArchive = false,
  }: IUnlinkObject): Promise<IBox> {
    const boxExistes = await this.boxesRepository.findByNameAndProjectId({
      name: boxName,
      projectId,
    })

    if (!boxExistes) {
      throw new AppError({
        title: 'Internal error',
        message:
          'Tivemos problemas ao processar as informações das boxes internas do projeto...',
        statusCode: 500,
      })
    }

    let archivesFiltered: IArchive[] = []

    let archiveToUpdate: IArchive | undefined

    if (!withoutArchive) {
      const archiveToUpdateFind: IArchive = boxExistes.archives.find(
        (file) => file.archive.id === archiveId,
      )

      if (!archiveToUpdateFind) return boxExistes

      archivesFiltered = boxExistes.archives.filter(
        (file) => file.archive.id !== archiveId,
      )

      archiveToUpdate = archiveToUpdateFind
    } else {
      archiveToUpdate = boxExistes.archives[0]
    }

    const archiveUpdated: IArchive = {
      ...archiveToUpdate,
      links: archiveToUpdate.links.filter(
        (link) => link.id !== objectToUnlinkId,
      ),
    }

    const updatedArchives: IArchive[] = [...archivesFiltered, archiveUpdated]

    const box = await this.boxesRepository.updateArchives({
      archives: updatedArchives,
      id: boxExistes.id,
    })

    return box
  }

  async linkObject({
    boxName,
    projectId,
    archiveId,
    objectToLinkId,
    withoutArchive = false,
  }: ILinkObject): Promise<ILinkObjectResponse> {
    const boxExistes = await this.boxesRepository.findByNameAndProjectId({
      name: boxName,
      projectId,
    })

    if (!boxExistes) {
      throw new AppError({
        title: 'Internal error',
        message:
          'Tivemos problemas ao processar as informações das boxes internas do projeto...',
        statusCode: 500,
      })
    }

    let archivesFiltered: IArchive[] = []

    let archiveToUpdate: IArchive | undefined

    if (!withoutArchive) {
      const archiveToUpdateFind: IArchive = boxExistes.archives.find(
        (file) => file.archive.id === archiveId,
      )

      archivesFiltered = boxExistes.archives.filter(
        (file) => file.archive.id !== archiveId,
      )

      archiveToUpdate = archiveToUpdateFind
    } else {
      archiveToUpdate = boxExistes.archives[0]
    }

    if (!archiveToUpdate) {
      throw new AppError({
        title: 'Arquivo não existente nas boxes internas',
        message: 'Você está tentando atribuir uma referencia inexistente...',
        statusCode: 404,
      })
    }

    const alreadyLinkedObject = archiveToUpdate.links.find(
      (link) => link.id === objectToLinkId,
    )

    if (alreadyLinkedObject) {
      throw new AppError({
        title: 'Você já criou essa referencia',
        message: 'Você já criou essa referencia anteriormente...',
        statusCode: 404,
      })
    }

    const archiveUpdated: IArchive = {
      ...archiveToUpdate,
      links: [...archiveToUpdate.links, { id: objectToLinkId, type: 'id' }],
    }

    const updatedArchives: IArchive[] = [...archivesFiltered, archiveUpdated]

    const box = await this.boxesRepository.updateArchives({
      archives: updatedArchives,
      id: boxExistes.id,
    })

    return { box, archive: archiveToUpdate }
  }
}
