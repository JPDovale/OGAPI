import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { AppError } from '@shared/errors/AppError'

interface IResponse {
  box: IBox
}

@injectable()
export class DeletePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute(userId: string, personId: string): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

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

    const box = await this.boxesControllers.unlinkObject({
      boxName: 'persons',
      objectToUnlinkId: personId,
      projectId: person.defaultProject,
      withoutArchive: true,
    })

    await this.personsRepository.deleteById(personId)

    return { box }
  }
}
