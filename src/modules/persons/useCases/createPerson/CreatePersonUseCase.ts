import { inject, injectable } from 'tsyringe'

import { ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { Archive } from '@modules/boxes/infra/mongoose/entities/schemas/Archive'
import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

interface IRequest {
  userId: string
  projectId: string
  newPerson: ICreatePersonDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreatePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({
    userId,
    projectId,
    newPerson,
  }: IRequest): Promise<IResponse> {
    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const person = await this.personsRepository.create(
      userId,
      projectId,
      newPerson,
    )

    const boxExistes = await this.boxesRepository.findByNameAndProjectId({
      name: 'persons',
      projectId,
    })

    if (!boxExistes) {
      const newBox: ICreateBoxDTO = {
        name: 'persons',
        internal: true,
        userId,
        projectId,
        tags: [
          {
            name: 'persons',
          },
          {
            name: project.name,
          },
        ],
      }

      const createdBox = await this.boxesRepository.create(newBox)

      const archivePersons = new Archive({
        archive: {
          id: '',
          title: '',
          description: '',
          createdAt: this.dateProvider.getDate(new Date()),
          updatedAt: this.dateProvider.getDate(new Date()),
        },
      })

      await this.boxesRepository.addArchive({
        archive: archivePersons,
        id: createdBox.id,
      })
    }

    const { box } = await this.boxesControllers.linkObject({
      boxName: 'persons',
      projectId,
      objectToLinkId: person.id,
      withoutArchive: true,
    })

    return { person, box }
  }
}
