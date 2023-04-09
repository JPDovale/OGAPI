import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IResponse {
  projects: IProjectMongo[]
  users: IUserInfosResponse[]
  persons: IPersonMongo[]
  books: IBook[]
  boxes: IBox[]
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
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
  ) {}

  async execute(userId: string): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw makeErrorUserNotFound()

    const projectsThisUser = user.admin
      ? await this.projectsRepository.listAll()
      : await this.projectsRepository.listPerUser(userId)
    const usersInfos: IUserInfosResponse[] = []
    let personsInfos: IPersonMongo[] = []
    let booksInfos: IBook[] = []
    let boxesInfos: IBox[] = []

    if (projectsThisUser[0]) {
      const projectsIds: string[] = []
      const userIds: string[] = []

      projectsThisUser.forEach((project) => {
        projectsIds.push(project.id)

        project.users.map((user) => {
          if (user.id === userId) return ''

          return userIds.push(user.id)
        })
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

      const persons = await this.personRepository.findByProjectIds(projectsIds)
      const books = await this.booksRepository.findByProjectIds(projectsIds)
      const boxes = await this.boxesRepository.findPerProjectIds(projectsIds)
      const boxesNotInternal =
        await this.boxesRepository.findNotInternalPerUserId(user.id)

      personsInfos = persons
      booksInfos = books
      boxesInfos = [...boxes, ...boxesNotInternal]
    }

    const response = {
      projects: projectsThisUser ?? [],
      users: usersInfos ?? [],
      persons: personsInfos ?? [],
      books: booksInfos ?? [],
      boxes: boxesInfos ?? [],
    }

    return response
  }
}
