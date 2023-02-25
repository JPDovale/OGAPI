import { inject, injectable } from 'tsyringe'

import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { ITag, Tag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

interface IRequest {
  userId: string
  projectId: string
  title: string
  subtitle: string
  authors: Array<{
    username?: string
    email?: string
    id?: string
  }>
  literaryGenere: string
  generes: Array<{ name?: string }>
  isbn: string
  words?: string
  writtenWords?: string
}

interface IResponse {
  book: IBook
  project: IProjectMongo
}

@injectable()
export class CreateBookUseCase {
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

    const exiteTagOnProject = project.tags?.find((tag) => tag.type === 'books')
    const filteredTagsOnProject = project.tags?.filter(
      (tag) => tag.type !== 'books',
    )
    let tags: ITag[]

    if (exiteTagOnProject) {
      const refs = exiteTagOnProject.refs
      refs[0].references.push(newBook.id)

      const updatedTag: ITag = {
        ...exiteTagOnProject,
        refs,
      }

      tags = [updatedTag, ...filteredTagsOnProject]
    } else {
      const newTag = new Tag({
        origPath: `${project.name}/books`,
        type: 'books',
        refs: [
          {
            object: {},
            references: [newBook.id],
          },
        ],
      })

      tags = [newTag, ...filteredTagsOnProject]
    }

    const updatedProject = await this.projectsRepository.updateTag(
      projectId,
      tags,
    )

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

    return { book: newBook, project: updatedProject }
  }
}
