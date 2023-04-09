import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Power } from '@modules/persons/infra/mongoose/entities/Power'
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
  power: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreatePowerUseCase {
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
    power,
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

    const powerExistesToThiPerson = person.powers.find(
      (p) => p.title === power.title,
    )
    if (powerExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um poder',
      })

    const newPower = new Power({
      description: power.description,
      title: power.title,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newPower,
      error: {
        title: 'Poder já existe nos arquivos internos do projeto.',
        message:
          'Você já criou um poder com esse nome para outro personagem... Caso o poder seja o mesma, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/powers',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatedPowers = [newPower, ...person.powers]
    const updatedPerson = await this.personsRepository.updatePowers(
      personId,
      updatedPowers,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, box }
  }
}
