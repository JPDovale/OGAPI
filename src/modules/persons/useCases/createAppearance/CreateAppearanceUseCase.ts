import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Appearance } from '@modules/persons/infra/mongoose/entities/Appearance'
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
  appearance: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreateAppearanceUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute({
    appearance,
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

    const appearanceExistesToThiPerson = person.appearance.find(
      (a) => a.title === appearance.title,
    )

    if (appearanceExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'uma aparência',
      })

    const newAppearance = new Appearance({
      title: appearance.title,
      description: appearance.description,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newAppearance,
      error: {
        title: 'Aparência já existe nos arquivos internos do projeto.',
        message:
          'Você já criou uma característica de aparência com esse nome para outro personagem... Caso a característica de aparência seja a mesma, tente atribui-la ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/appearance',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatedAppearances = [newAppearance, ...person.appearance]
    const updatedPerson = await this.personsRepository.updateAppearance(
      personId,
      updatedAppearances,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, box }
  }
}
