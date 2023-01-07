import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IUserInfosResponse } from '@modules/accounts/responses/IUserInfosResponse'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'

interface IResponse {
  projects: IProjectMongo[]
  users: IUserInfosResponse[]
  persons: IPersonMongo[]
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
  ) {}

  async execute(userId: string): Promise<IResponse> {
    const projectsThisUser = await this.projectsRepository.listPerUser(userId)
    const usersInfos: IUserInfosResponse[] = []
    const personsInfos: IPersonMongo[] = []

    if (projectsThisUser[0]) {
      const userIds = []
      const personsIds = []

      projectsThisUser.forEach((project) => {
        project.users.map((user) => {
          if (user.id === userId) return ''
          return userIds.push(user.id)
        })

        project.tags
          .find((tag) => tag.type === 'persons')
          ?.refs[0].references.map((ref) => personsIds.push(ref))
      })

      const rest = new Set(userIds)
      const usersToShare = [...rest]

      await Promise.all(
        usersToShare.map(async (id) => {
          const user = await this.usersRepository.findById(id)
          const infoUser: IUserInfosResponse = {
            id: user.id,
            avatar: user.avatar,
            age: user.age,
            email: user.email,
            sex: user.sex,
            username: user.username,
            createAt: user.createAt,
            updateAt: user.updateAt,
          }

          usersInfos.push(infoUser)
        }),
      )

      await Promise.all(
        personsIds.map(async (id) => {
          const person = await this.personRepository.findById(id)
          personsInfos.push(person)
        }),
      )
    }

    return {
      projects: projectsThisUser,
      users: usersInfos || [],
      persons: personsInfos || [],
    }
  }
}
