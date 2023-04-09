import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Dream } from '@modules/persons/infra/mongoose/entities/Dream'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'

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

    if (!person) throw makeErrorPersonNotFound()

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: projectId ?? person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const dreamExistesToThiPerson = person.dreams.find(
      (d) => d.title === dream.title,
    )

    if (dreamExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um sonho',
      })

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

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, box }
  }
}
