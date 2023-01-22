import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'
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
  ) {}

  async execute(userId: string, personId: string): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    const permissionToEditProject = container.resolve(PermissionToEditProject)
    const { project } = await permissionToEditProject.verify(
      userId,
      person.defaultProject,
      'edit',
    )

    if (!project) {
      throw new AppError({
        title: 'Projeto não encontrado.',
        message: 'Parece que esse projeto não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    try {
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
    } catch (err) {
      console.log(err)
      throw new AppError({
        title: 'Internal error',
        message: 'Try again later.',
        statusCode: 500,
      })
    }
  }
}
