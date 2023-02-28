import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  bookId: string
}

@injectable()
export class DeleteBookUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ bookId, userId }: IRequest): Promise<void> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) {
      throw new AppError({
        title: 'O livro não existe',
        message: 'Parece que esse livro não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const { project, user } = await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    await this.booksRepository.deletePerId(book.id)

    const tagBooks = project.tags?.find((tag) => tag.type === 'books')
    const filteredTagsOnProject = project.tags?.filter(
      (tag) => tag.type !== 'books',
    )

    const refs = tagBooks.refs
    refs[0].references = refs[0].references.filter((ref) => ref !== book.id)

    const updatedTag: ITag = {
      ...tagBooks,
      refs,
    }

    const tags = [updatedTag, ...filteredTagsOnProject]

    await this.projectsRepository.updateTag(project.id, tags)

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} apagou o livro: ${book.title}`,
      `${user.username} acabou de apagar o livro ${book.title}${
        book.subtitle ? ` ${book.subtitle}` : ''
      } no projeto: ${project.name}. `,
    )
  }
}
