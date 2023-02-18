import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { ICacheProvider } from '@shared/container/provides/CacheProvider/ICacheProvider'

interface IResponse {
  projects: IProjectMongo[]
  users: IUserInfosResponse[]
  persons: IPersonMongo[]
  books: IBook[]
}
@injectable()
export class ListProjectsPerUserUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('PersonsRepository')
    private readonly personRepository: IPersonsRepository,
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute(userId: string): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)
    const projectsThisUser = user.admin
      ? await this.projectsRepository.listAll()
      : await this.projectsRepository.listPerUser(userId)
    const usersInfos: IUserInfosResponse[] = []
    let personsInfos: IPersonMongo[] = []
    let booksInfos: IBook[] = []

    if (projectsThisUser[0]) {
      const userIds = []
      const personsIds = []
      const booksIds = []

      projectsThisUser.forEach((project) => {
        project.users.map((user) => {
          if (user.id === userId) return ''
          return userIds.push(user.id)
        })

        project.tags
          .find((tag) => tag.type === 'persons')
          ?.refs[0].references.map((ref) => personsIds.push(ref))

        project.tags
          .find((tag) => tag.type === 'books')
          ?.refs[0].references.map((ref) => booksIds.push(ref))
      })

      const rest = new Set(userIds)
      const usersToShare = [...rest]

      const usersShared = usersToShare[0]
        ? await this.usersRepository.findManyById(usersToShare)
        : []

      usersShared.map((user) => {
        const infoUser: IUserInfosResponse = {
          id: user.id,
          avatar: user.avatar,
          age: user.age,
          email: user.email,
          sex: user.sex,
          username: user.username,
          createAt: user.createAt,
          updateAt: user.updateAt,
          isInitialized: user.isInitialized,
          name: user.name,
          notifications: user.notifications,
          isSocialLogin: user.isSocialLogin,
        }
        return usersInfos.push(infoUser)
      })

      const persons = personsIds[0]
        ? await this.personRepository.findManyById(personsIds)
        : []

      const books = booksIds[0]
        ? await this.booksRepository.findManyById({ ids: booksIds })
        : []

      personsInfos = persons
      booksInfos = books
    }

    const response = {
      projects: projectsThisUser || [],
      users: usersInfos || [],
      persons: personsInfos || [],
      books: booksInfos || [],
    }

    return response
  }
}
