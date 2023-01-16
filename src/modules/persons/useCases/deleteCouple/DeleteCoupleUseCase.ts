import {
  // container,
  inject,
  injectable,
} from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteCoupleUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    coupleId: string,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)
    // const permissionToEditProject = container.resolve(PermissionToEditProject)
    // const { project } = await permissionToEditProject.verify(
    //   userId,
    //   person.defaultProject,
    //   'edit',
    // )

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    if (person.fromUser !== userId) {
      throw new AppError({
        title: 'Permissão de alteração invalida.',
        message:
          'Você não tem permissão para apagar esse personagem, pois ele pertence a outro usuário',
        statusCode: 401,
      })
    }

    const filteredCouples = person.couples.filter(
      (couple) => couple.id !== coupleId,
    )

    const updatePerson = await this.personsRepository.updateCouples(
      personId,
      filteredCouples,
    )
    return updatePerson
  }
}
