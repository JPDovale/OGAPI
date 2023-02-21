import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteProjectUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
  ) {}

  async execute(projectId: string, userId: string): Promise<void> {
    const project = await this.projectsRepository.findById(projectId)
    const user = await this.usersRepository.findById(userId)

    if (!user)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    if (!project)
      throw new AppError({
        title: 'Projeto não encontrado.',
        message: 'Parece que esse projeto não existe na nossa base de dados...',
        statusCode: 404,
      })

    if (project.createdPerUser !== userId) {
      throw new AppError({
        title: 'Acesso negado!',
        message:
          'Você não tem permissão para deletar o projeto, pois ele pertence a outro usuário.',
        statusCode: 401,
      })
    }

    await this.projectsRepository.delete(projectId)
    await this.personsRepository.deletePerProjectId(projectId)
    await this.booksRepository.deletePerProjectId(projectId)
    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} deletou o projeto.`,
      `${user.username} acabou de deletar o projeto o qual havia sido compartilhado com você: ${project.name} `,
    )
  }
}
