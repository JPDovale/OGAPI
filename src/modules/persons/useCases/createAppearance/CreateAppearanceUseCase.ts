import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Appearance } from '@modules/persons/infra/mongoose/entities/Appearance'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    const appearanceExistesToThiPerson = person.appearance.find(
      (a) => a.title === appearance.title,
    )

    if (appearanceExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe uma aparência com esse nome.',
        message:
          'Já existe uma aparência com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

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

    return { person: updatedPerson, box }
  }
}
