import { inject, injectable } from 'tsyringe'

import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'
import {
  Comment,
  type IComment,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'

interface IRequest {
  userId: string
  personId: string
  comment: ICommentPlotProjectDTO
}

@injectable()
export class CommentInPersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    userId,
    personId,
    comment,
  }: IRequest): Promise<IPersonMongo> {
    const { content, to } = comment

    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    const { user } = await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'comment',
    })

    const newComment = new Comment({
      content,
      to,
      userId,
      username: user.username,
    })

    const comments: IComment[] = [{ ...newComment }, ...person.comments]

    const updatedPerson = await this.personsRepository.updateCommentsPerson(
      personId,
      comments,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
