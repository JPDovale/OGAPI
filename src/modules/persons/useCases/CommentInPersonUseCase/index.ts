import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ICommentsRepository } from '@modules/projects/infra/repositories/contracts/ICommentsRepository'
import { type Comment } from '@prisma/client'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorCommentNotCreated } from '@shared/errors/projects/makeErrorCommentNotCreated'
import { mapperObjectsInPerson } from '@utils/mappers/mapperObjectsInPerson'

interface IRequest {
  userId: string
  personId: string
  content: string
  toId: string
  commentIn:
    | 'appearance'
    | 'objective'
    | 'personality'
    | 'dream'
    | 'fear'
    | 'power'
    | 'couple'
    | 'value'
    | 'wishe'
    | 'trauma'
}

interface IResponse {
  comment: Comment
}

const factoryComment = {
  appearance: (id, usrId, content) => {
    return { appearance_id: id, user_id: usrId, content }
  },
  objective: (id, usrId, content) => {
    return { objective_id: id, user_id: usrId, content }
  },
  personality: (id, usrId, content) => {
    return { personality_id: id, user_id: usrId, content }
  },
  dream: (id, usrId, content) => {
    return { dream_id: id, user_id: usrId, content }
  },
  fear: (id, usrId, content) => {
    return { fear_id: id, user_id: usrId, content }
  },
  power: (id, usrId, content) => {
    return { power_id: id, user_id: usrId, content }
  },
  couple: (id, usrId, content) => {
    return { couple_id: id, user_id: usrId, content }
  },
  value: (id, usrId, content) => {
    return { value_id: id, user_id: usrId, content }
  },
  wishe: (id, usrId, content) => {
    return { wishe_id: id, user_id: usrId, content }
  },
  trauma: (id, usrId, content) => {
    return { trauma_id: id, user_id: usrId, content }
  },
}

const mapperToCommentIn = mapperObjectsInPerson

@injectable()
export class CommentInPersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute({
    userId,
    personId,
    content,
    toId,
    commentIn,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'comment',
    })

    const commentFactoredIn = factoryComment[mapperToCommentIn[commentIn]](
      toId,
      userId,
      content,
    )

    const comment = await this.commentsRepository.create(commentFactoredIn)
    if (!comment) throw makeErrorCommentNotCreated()

    return { comment }
  }
}
