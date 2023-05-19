import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'

interface IRequest {
  personId: string
  userId: string
}

@injectable()
export class DeletePersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Repositories.TimeEventsRepository)
    private readonly timeEventsRepository: ITimeEventsRepository,
  ) {}

  async execute({ personId, userId }: IRequest): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    if (person.user_id !== userId) throw makeErrorDeniedPermission()

    if (person.image_filename) {
      await this.storageProvider.delete(person.image_filename, 'persons/images')
    }

    if (person.timeEventBorn?.timeEvent) {
      const timeEventId = person.timeEventBorn.timeEvent.id
      await this.timeEventsRepository.delete(timeEventId)
    }

    await this.personsRepository.delete(personId)
  }
}
