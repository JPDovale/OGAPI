import { inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'
import {
  Comment,
  IComment,
  Response,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

@injectable()
export class ResponseCommentPersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    commentId: string,
    response: IResponseCommentPlotProjectDTO,
  ): Promise<IPersonMongo> {
    const { content } = response

    const person = await this.personsRepository.findById(personId)

    const { user } = await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'comment',
    })

    const newResponse = new Response({
      content,
      userId,
      username: user.username,
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

    const updatedComments: IComment[] = [updatedComment, ...filteredComments]

    const personUpdated = await this.personsRepository.updateCommentsPerson(
      personId,
      updatedComments,
    )
    return personUpdated
  }
}
