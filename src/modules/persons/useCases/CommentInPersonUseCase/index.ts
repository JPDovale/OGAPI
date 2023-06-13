import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ICommentsRepository } from '@modules/projects/infra/repositories/contracts/ICommentsRepository'
import { type Comment } from '@prisma/client'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorCommentNotCreated } from '@shared/errors/projects/makeErrorCommentNotCreated'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
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
  appearance: (id, usrId, prjId, content) => {
    return { appearance_id: id, user_id: usrId, project_id: prjId, content }
  },
  objective: (id, usrId, prjId, content) => {
    return { objective_id: id, user_id: usrId, project_id: prjId, content }
  },
  personality: (id, usrId, prjId, content) => {
    return { personality_id: id, user_id: usrId, project_id: prjId, content }
  },
  dream: (id, usrId, prjId, content) => {
    return { dream_id: id, user_id: usrId, project_id: prjId, content }
  },
  fear: (id, usrId, prjId, content) => {
    return { fear_id: id, user_id: usrId, project_id: prjId, content }
  },
  power: (id, usrId, prjId, content) => {
    return { power_id: id, user_id: usrId, project_id: prjId, content }
  },
  couple: (id, usrId, prjId, content) => {
    return { couple_id: id, user_id: usrId, project_id: prjId, content }
  },
  value: (id, usrId, prjId, content) => {
    return { value_id: id, user_id: usrId, project_id: prjId, content }
  },
  wishe: (id, usrId, prjId, content) => {
    return { wishe_id: id, user_id: usrId, project_id: prjId, content }
  },
  trauma: (id, usrId, prjId, content) => {
    return { trauma_id: id, user_id: usrId, project_id: prjId, content }
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
  }: IRequest): Promise<IResolve<IResponse>> {
    const person = await this.personsRepository.findById(personId)
    if (!person) {
      return {
        ok: false,
        error: makeErrorPersonNotFound(),
      }
    }

    const response = await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'comment',
      verifyFeatureInProject: ['persons'],
    })

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    const commentFactoredIn = factoryComment[mapperToCommentIn[commentIn]](
      toId,
      userId,
      person.project_id,
      content,
    )

    const comment = await this.commentsRepository.create(commentFactoredIn, {
      key: commentIn,
      deleteCache: {
        personId,
      },
    })
    if (!comment) {
      return {
        ok: false,
        error: makeErrorCommentNotCreated(),
      }
    }

    return {
      ok: true,
      data: {
        comment,
      },
    }
  }
}
