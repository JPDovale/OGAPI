import { inject, injectable } from 'tsyringe'

import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdatePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    person: ICreatePersonDTO,
  ): Promise<IPersonMongo> {
    const personExite = await this.personsRepository.findById(personId)

    await this.verifyPermissions.verify({
      userId,
      projectId: personExite.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!personExite) {
      throw new AppError({
        title: 'Personagem não encontrado.',
        message:
          'Parece que esse personagem não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    const updatedPerson = await this.personsRepository.updatePerson(
      personId,
      person,
    )

    return updatedPerson
  }
}
