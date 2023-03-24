import { inject, injectable } from 'tsyringe'

import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { type ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
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

@injectable()
export class UpdateCapituleUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({
    bookId,
    userId,
    capituleId,
    name,
    objective,
    structure,
  }: IRequest): Promise<IBook> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) throw makeErrorBookNotFound()

    await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    const capituleToUpdate = book.capitules.find(
      (capitule) => capitule.id === capituleId,
    )
    const indexOfCapituleToUpdate = book.capitules.findIndex(
      (capitule) => capitule.id === capituleId,
    )

    if (!capituleToUpdate || indexOfCapituleToUpdate < 0)
      throw makeErrorCapituleNotFound()

    const capitule: ICapitule = {
      ...capituleToUpdate,
      name: name ?? capituleToUpdate.name,
      objective: objective ?? capituleToUpdate.objective,
      structure: {
        act1: structure?.act1
          ? structure.act1
          : capituleToUpdate.structure.act1,
        act2: structure?.act2
          ? structure.act2
          : capituleToUpdate.structure.act2,
        act3: structure?.act3
          ? structure.act3
          : capituleToUpdate.structure.act3,
      },
      updatedAt: this.dateProvider.getDate(new Date()),
    }

    const capitules = book.capitules
    capitules[indexOfCapituleToUpdate] = capitule

    const updatedBook = await this.booksRepository.updateCapitules({
      capitules,
      id: bookId,
      writtenWords: book.writtenWords,
    })

    if (!updatedBook) throw makeErrorBookNotUpdate()

    return updatedBook
  }
}
