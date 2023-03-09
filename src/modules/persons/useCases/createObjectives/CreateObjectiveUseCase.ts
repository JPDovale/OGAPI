import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { ICreateObjectiveDTO } from '@modules/persons/dtos/ICreateObjectiveDTO'
import { Objective } from '@modules/persons/infra/mongoose/entities/Objective'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  objective: ICreateObjectiveDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreateObjectiveUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute({
    objective,
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

    const objectiveExistesToThiPerson = person.objectives.find(
      (o) => o.title === objective.title,
    )
    if (objectiveExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um objetivo com esse nome.',
        message:
          'Já existe um objetivo com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const newObjective = new Objective({
      avoiders: objective.avoiders,
      description: objective.description,
      objectified: objective.objectified,
      supporting: objective.supporting,
      title: objective.title,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newObjective,
      error: {
        title: 'objetivo já existe nos arquivos internos do projeto.',
        message:
          'Você já criou um objetivo com esse nome para outro personagem... Caso o objetivo seja o mesma, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/objectives',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatedObjetives = [newObjective, ...person.objectives]
    const updatedPerson = await this.personsRepository.updateObjectives(
      personId,
      updatedObjetives,
    )

    return { person: updatedPerson, box }
  }
}
