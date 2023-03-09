import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { ICreateGenericObjectWithConsequencesDTO } from '@modules/persons/dtos/ICreateGenericObjectWithConsequencesDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Trauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  trauma: ICreateGenericObjectWithConsequencesDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}
@injectable()
export class CreateTraumaUseCase {
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
    trauma,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person)
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: projectId || person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const traumaExistesToThiPerson = person.traumas.find(
      (t) => t.title === trauma.title,
    )
    if (traumaExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um trauma com esse nome.',
        message:
          'Já existe um trauma com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const newTrauma = new Trauma({
      title: trauma.title,
      consequences: trauma.consequences || [],
      description: trauma.description,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newTrauma,
      error: {
        title: 'trauma já existe nos arquivos internos do projeto.',
        message:
          'Você já criou um trauma com esse nome para outro personagem... Caso o trauma seja o mesma, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/traumas',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updateTraumas = [newTrauma, ...person.traumas]
    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updateTraumas,
    )

    return { person: updatedPerson, box }
  }
}
