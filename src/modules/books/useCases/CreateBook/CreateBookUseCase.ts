import { inject, injectable } from 'tsyringe'

import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { type ICreateBoxDTO } from '@modules/boxes/dtos/ICrateBoxDTO'
import { Archive } from '@modules/boxes/infra/mongoose/entities/schemas/Archive'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookNotCreated } from '@shared/errors/books/makeErrorBookNotCreated'

interface IRequest {
  userId: string
  projectId: string
  title: string
  subtitle?: string
  authors: Array<{
    username?: string
    email?: string
    id?: string
  }>
  literaryGenere: string
  generes: Array<{ name?: string }>
  isbn?: string
  words?: string
  writtenWords?: string
}

interface IResponse {
  book: IBook
  box: IBox
}

@injectable()
export class CreateBookUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({
    userId,
    projectId,
    title,
    subtitle,
    authors,
    literaryGenere,
    generes,
    isbn,
    words,
    writtenWords,
  }: IRequest): Promise<IResponse> {
    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const newBook = await this.booksRepository.create({
      projectId,
      book: {
        createdPerUser: userId,
        authors,
        generes,
        literaryGenere,
        title,
        isbn,
        subtitle,
        words,
        writtenWords,
      },
    })

    if (!newBook) throw makeErrorBookNotCreated()

    const boxExistes = await this.boxesRepository.findByNameAndProjectId({
      name: 'books',
      projectId,
    })

    if (!boxExistes) {
      const newBox: ICreateBoxDTO = {
        name: 'books',
        internal: true,
        userId,
        projectId,
        tags: [
          {
            name: 'books',
          },
          {
            name: project.name,
          },
        ],
      }

      const createdBox = await this.boxesRepository.create(newBox)

      if (!createdBox) {
        await this.booksRepository.deletePerId(newBook.id)
        throw makeErrorBookNotCreated()
      }

      const archiveBooks = new Archive({
        archive: {
          id: '',
          title: '',
          description: '',
          createdAt: this.dateProvider.getDate(new Date()),
          updatedAt: this.dateProvider.getDate(new Date()),
        },
      })

      await this.boxesRepository.addArchive({
        archive: archiveBooks,
        id: createdBox.id,
      })
    }

    const { box } = await this.boxesControllers.linkObject({
      boxName: 'books',
      projectId,
      objectToLinkId: newBook.id,
      withoutArchive: true,
    })

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} criou o livro: ${newBook.title}`,
      `${user.username} acabou de criar o livro ${newBook.title}${
        newBook.subtitle ? ` ${newBook.subtitle}` : ''
      } no projeto: ${
        project.name
      }. Acesse a aba 'Livros' para ver mais informações.`,
    )

    return { book: newBook, box }
  }
}
