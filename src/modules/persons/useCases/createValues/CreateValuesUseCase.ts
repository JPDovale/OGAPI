import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { ICreateGenericObjectWithExceptionsDTO } from '@modules/persons/dtos/ICreateGenericObjectWithExceptionsDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { Value } from '@modules/persons/infra/mongoose/entities/Value'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  value: ICreateGenericObjectWithExceptionsDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreateValueUseCase {
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
    projectId,
    userId,
    value,
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

    const valueExistesToThiPerson = person.values.find(
      (t) => t.title === value.title,
    )
    if (valueExistesToThiPerson) {
      throw new AppError({
        title: 'Já existe um valor com esse nome.',
        message:
          'Já existe um valor com esse nome para esse personagem. Tente com outro nome.',
        statusCode: 409,
      })
    }

    const newValue = new Value({
      description: value.description,
      title: value.title,
      exceptions: value.exceptions || [],
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newValue,
      error: {
        title: 'Valor já existe nos arquivos internos do projeto.',
        message:
          'Você já criou um valor com esse nome para outro personagem... Caso o valor seja o mesma, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/values',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatedObjetives = [newValue, ...person.values]
    const updatedPerson = await this.personsRepository.updateValues(
      personId,
      updatedObjetives,
    )

    return { person: updatedPerson, box }
  }
}
