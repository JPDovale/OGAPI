import { inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'
import {
  Comment,
  IComment,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

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
    return updatedPerson
  }
}
