import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'

interface IRequest {
  userId: string
  bookId: string
}

interface IResponse {
  box: IBox
}

@injectable()
export class DeleteBookUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ bookId, userId }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) throw makeErrorBookNotFound()

    const { project, user } = await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    const box = await this.boxesControllers.unlinkObject({
      boxName: 'persons',
      objectToUnlinkId: bookId,
      projectId: book.defaultProject,
      withoutArchive: true,
    })

    await this.booksRepository.deletePerId(book.id)

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} apagou o livro: ${book.title}`,
      `${user.username} acabou de apagar o livro ${book.title}${
        book.subtitle ? ` ${book.subtitle}` : ''
      } no projeto: ${project.name}. `,
    )

    return { box }
  }
}
