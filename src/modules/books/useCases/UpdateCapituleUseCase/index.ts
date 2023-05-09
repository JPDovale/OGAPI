import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'

interface IRequest {
  bookId: string
  userId: string
  capituleId: string
  name?: string
  objective?: string
  structure?: {
    act1?: string
    act2?: string
    act3?: string
  }
}

interface IResponse {
  capitule: ICapitule
}

@injectable()
export class UpdateCapituleUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CapitulesRepository)
    private readonly capitulesRepository: ICapitulesRepository,
  ) {}

  async execute({
    bookId,
    userId,
    capituleId,
    name,
    objective,
    structure,
  }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()
    if (!book.capitules) throw makeErrorCapituleNotFound()

    await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    const capituleToUpdate = await this.capitulesRepository.findById(capituleId)
    if (!capituleToUpdate) throw makeErrorCapituleNotFound()

    const capitule = await this.capitulesRepository.update({
      capituleId,
      data: {
        name,
        objective,
        structure_act_1: structure?.act1,
        structure_act_2: structure?.act2,
        structure_act_3: structure?.act3,
      },
    })

    if (!capitule) throw makeErrorBookNotUpdate()

    return { capitule }
  }
}
