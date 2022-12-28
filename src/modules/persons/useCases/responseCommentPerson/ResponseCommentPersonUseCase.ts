import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'
import {
  Comment,
  IComment,
  Response,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'

@injectable()
export class ResponseCommentPersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
  ) {}

  async execute(
    userId: string,
    personId: string,
    commentId: string,
    response: IResponseCommentPlotProjectDTO,
  ): Promise<void> {
    const { content } = response

    const person = await this.personsRepository.findById(personId)

    const permissionToComment = container.resolve(PermissionToEditProject)
    const { user } = await permissionToComment.verify(
      userId,
      person.defaultProject,
      'comment',
    )

    const newResponse = new Response({
      content,
      userId,
      username: user.username,
      userAvata: user.avatar,
    })

    const comment: IComment = person.comments.find(
      (comment: Comment) => comment.id === commentId,
    )
    const filteredComments = person.comments.filter(
      (comment: Comment) => comment.id !== commentId,
    ) as Comment[]

    const updatedComment: IComment = {
      ...comment,
      responses: [newResponse, ...comment.responses],
    }

    const updatedPerson: IPersonMongo = {
      ...person,
      comments: [updatedComment, ...filteredComments],
    }

    await this.personsRepository.updatePerson(personId, updatedPerson)
  }
}
