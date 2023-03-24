import { inject, injectable } from 'tsyringe'

import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { type IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'
import {
  type Comment,
  type IComment,
  Response,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorCommentNotFound } from '@shared/errors/useFull/makeErrorCommentNotFound'

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

    if (!person) throw makeErrorPersonNotFound()

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

    const comment = person.comments.find(
      (comment: Comment) => comment.id === commentId,
    )
    const filteredComments = person.comments.filter(
      (comment: Comment) => comment.id !== commentId,
    )

    if (!comment) throw makeErrorCommentNotFound()

    const updatedComment: IComment = {
      ...comment,
      responses: [newResponse, ...comment?.responses],
    }

    const updatedComments: IComment[] = [updatedComment, ...filteredComments]

    const personUpdated = await this.personsRepository.updateCommentsPerson(
      personId,
      updatedComments,
    )

    if (!personUpdated) throw makeErrorPersonNotUpdate()

    return personUpdated
  }
}
