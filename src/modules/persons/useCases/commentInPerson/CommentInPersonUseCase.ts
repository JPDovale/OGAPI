import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'
import { Comment } from '@modules/projects/infra/mongoose/entities/Comment'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'

@injectable()
export class CommentInPersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    comment: ICommentPlotProjectDTO,
  ): Promise<void> {
    const { content, to } = comment

    const person = await this.personsRepository.findById(personId)

    const permissionToComment = container.resolve(PermissionToEditProject)
    const { user } = await permissionToComment.verify(
      userId,
      person.defaultProject,
      'comment',
    )

    const newComment = new Comment({
      content,
      to,
      userId,
      username: user.username,
      userAvata: user.avatar,
    })

    const personUpdated: IPersonMongo = {
      ...person,
      comments: [newComment, ...person.comments],
    }

    await this.personsRepository.updatePerson(personId, personUpdated)
  }
}
