import { inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteImagePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(userId: string, personId: string): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!project) {
      throw new AppError({
        title: 'Projeto não encontrado.',
        message: 'Parece que esse projeto não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    if (!person?.image.fileName) {
      throw new AppError({
        title: 'Image não encontrada.',
        message: 'Não existe uma imagem para esse personagem.',
        statusCode: 404,
      })
    }

    const updatedPerson = await this.personsRepository.updateImage(
      {
        fileName: '',
        url: '',
        createdAt: this.dateProvider.getDate(new Date()),
      },
      personId,
    )

    await this.storageProvider.delete(person.image.fileName, 'persons/images')

    return updatedPerson
  }
}
