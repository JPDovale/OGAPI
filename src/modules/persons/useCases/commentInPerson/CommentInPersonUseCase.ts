import { container, inject, injectable } from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'
import {
  Comment,
  IComment,
} from '@modules/projects/infra/mongoose/entities/Comment'
import { PermissionToEditProject } from '@modules/projects/services/verify/PermissionToEditProject'

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
  ) {}

  async execute({
    userId,
    personId,
    comment,
  }: IRequest): Promise<IPersonMongo> {
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
    })

    const comments: IComment[] = [{ ...newComment }, ...person.comments]

    const updatedPerson = await this.personsRepository.updateCommentsPerson(
      personId,
      comments,
    )
    return updatedPerson
  }
}
