import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Power } from '@modules/persons/infra/mongoose/entities/Power'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    const powerExistesToThiPerson = person.powers.find(
      (p) => p.title === power.title,
    )
    if (powerExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um poder com esse nome.',
        message:
          'Já existe um poder com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

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

    return { person: updatedPerson, box }
  }
}
