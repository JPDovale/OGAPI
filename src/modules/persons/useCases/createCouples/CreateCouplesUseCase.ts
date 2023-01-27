import { container, inject, injectable } from 'tsyringe'

import { ICreateCoupleDTO } from '@modules/persons/dtos/ICreateCoupleDTO'
import { Couple } from '@modules/persons/infra/mongoose/entities/Couple'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  couple: ICreateCoupleDTO
}

interface IResponse {
  person: IPersonMongo
  personOfCouple: IPersonMongo
}

@injectable()
export class CreateCoupleUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({
    userId,
    couple,
    personId,
    projectId,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    const personOfCouple = await this.personsRepository.findById(
      couple.personId,
    )

    if (!person || !personOfCouple) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    await permissionToEditProject.verify(
      userId,
      projectId || person.defaultProject,
      'edit',
    )

    const coupleExisteToThisPerson = person.couples.find(
      (c) => c.personId === couple.personId,
    )
    const personOfCoupleExisteToThisPerson = personOfCouple?.couples.find(
      (c) => c.personId === personId,
    )

    if (coupleExisteToThisPerson || personOfCoupleExisteToThisPerson) {
      throw new AppError({
        title: 'Já existe uma casal relacionado a esse personagem.',
        message:
          'Já existe uma casal relacionado a esse personagem. Tente com outro personagem.',
        statusCode: 409,
      })
    }

    const newCouple = new Couple({
      description: couple.description,
      title: couple.title,
      final: couple.final,
      personId: couple.personId,
    })

    const newCoupleToPersonOfCouple = new Couple({
      description: couple.description,
      title: couple.title,
      final: couple.final,
      personId,
    })

    const updatedCouples = [newCouple, ...person.couples]
    const updatedPerson = await this.personsRepository.updateCouples(
      personId,
      updatedCouples,
    )

    const updatedCoupleToPersonOfCouple = [
      newCoupleToPersonOfCouple,
      ...personOfCouple.couples,
    ]
    const updatedPersonOfCouple = await this.personsRepository.updateCouples(
      couple.personId,
      updatedCoupleToPersonOfCouple,
    )

    return { person: updatedPerson, personOfCouple: updatedPersonOfCouple }
  }
}
