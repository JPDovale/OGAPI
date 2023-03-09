import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Fear } from '@modules/persons/infra/mongoose/entities/Fear'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  fear: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreateFearUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute({
    userId,
    projectId,
    personId,
    fear,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: projectId || person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const fearExistesToThiPerson = person.fears.find(
      (f) => f.title === fear.title,
    )
    if (fearExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um medo com esse nome.',
        message:
          'Já existe um medo com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const newFear = new Fear({
      description: fear.description,
      title: fear.title,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newFear,
      error: {
        title: 'Medo já existe nos arquivos internos do projeto.',
        message:
          'Você já criou um medo com esse nome para outro personagem... Caso o medo seja o mesma, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/fears',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatedFears = [newFear, ...person.fears]
    const updatedPerson = await this.personsRepository.updateFears(
      personId,
      updatedFears,
    )

    return { person: updatedPerson, box }
  }
}
