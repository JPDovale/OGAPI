import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'

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

    if (!person) throw makeErrorPersonNotFound()

    if (person.fromUser !== userId) throw makeErrorDeniedPermission()

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
