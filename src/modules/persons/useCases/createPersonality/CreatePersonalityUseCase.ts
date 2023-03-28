import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type ICreateGenericObjectWithConsequencesDTO } from '@modules/persons/dtos/ICreateGenericObjectWithConsequencesDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Personality } from '@modules/persons/infra/mongoose/entities/Personality'
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
  personality: ICreateGenericObjectWithConsequencesDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreatePersonalityUseCase {
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
    personality,
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

    const personalityExistesToThiPerson = person.personality.find(
      (p) => p.title === personality.title,
    )
    if (personalityExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'uma característica de personalidade',
      })

    const newPersonality = new Personality({
      title: personality.title,
      consequences: personality.consequences ?? [],
      description: personality.description,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newPersonality,
      error: {
        title:
          'Característica de personalidade já existe nos arquivos internos do projeto.',
        message:
          'Você já criou uma característica de personalidade  com esse nome para outro personagem... Caso o característica de personalidade  seja o mesma, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/personality',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatePersonality = [newPersonality, ...person.personality]
    const updatedPerson = await this.personsRepository.updatePersonality(
      personId,
      updatePersonality,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, box }
  }
}
