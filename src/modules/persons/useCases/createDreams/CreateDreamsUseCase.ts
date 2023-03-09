import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Dream } from '@modules/persons/infra/mongoose/entities/Dream'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  dream: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreateDreamUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute({
    dream,
    personId,
    projectId,
    userId,
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

    const dreamExistesToThiPerson = person.dreams.find(
      (d) => d.title === dream.title,
    )

    if (dreamExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um sonho com esse nome.',
        message:
          'Já existe um sonho com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const newDream = new Dream({
      description: dream.description,
      title: dream.title,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newDream,
      error: {
        title: 'Sonho já existe nos arquivos internos do projeto.',
        message:
          'Você já criou um sonho com esse nome para outro personagem... Caso o sonho seja o mesmo, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/dreams',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatedDreams = [newDream, ...person.dreams]
    const updatedPerson = await this.personsRepository.updateDreams(
      personId,
      updatedDreams,
    )

    return { person: updatedPerson, box }
  }
}
