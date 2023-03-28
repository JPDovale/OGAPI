import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Wishe } from '@modules/persons/infra/mongoose/entities/Wishe'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  wishe: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreateWisheUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute({
    personId,
    projectId,
    userId,
    wishe,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: projectId ?? person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const wisheExistesToThiPerson = person.wishes?.find(
      (w) => w.title === wishe.title,
    )
    if (wisheExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um desejo',
      })

    const newWishe = new Wishe({
      description: wishe.description,
      title: wishe.title,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newWishe,
      error: {
        title: 'Desejo já existe nos arquivos internos do projeto.',
        message:
          'Você já criou um desejo com esse nome para outro personagem... Caso o desejo seja o mesma, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/wishes',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatedWishes = [newWishe, ...person.wishes]
    const updatedPerson = await this.personsRepository.updateWishes(
      personId,
      updatedWishes,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, box }
  }
}
