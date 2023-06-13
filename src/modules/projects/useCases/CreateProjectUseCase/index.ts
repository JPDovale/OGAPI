import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type IFeaturesProjectUses } from '@modules/projects/infra/repositories/entities/IProject'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorProjectNotCreated } from '@shared/errors/projects/makeErrorProjectNotCreated'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
import { getListFeaturesInLine } from '@utils/application/dataTransformers/projects/features'

interface IRequest {
  userId: string
  name: string
  type: 'book' | 'rpg' | 'roadMap' | 'gameplay'
  private?: boolean
  password?: string
  features: IFeaturesProjectUses
  timeLine?: {
    initialDate: number
    timeChrist: 'A.C.' | 'D.C.'
  }
}

@injectable()
export class CreateProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({
    features,
    name,
    type,
    userId,
    password,
    private: priv,
    timeLine,
  }: IRequest): Promise<IResolve> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return {
        ok: false,
        error: makeErrorUserNotFound(),
      }
    }

    const numberOfProjectsThisUser = user._count?.projects ?? 0

    if (
      numberOfProjectsThisUser >= 1 &&
      user.subscription?.payment_status !== 'active'
    ) {
      return {
        ok: false,
        error: makeErrorLimitFreeInEnd(),
      }
    }

    const featuresListInLine = getListFeaturesInLine(features)

    const timestamp = this.dateProvider.getTimestamp({
      year: timeLine?.initialDate ?? 0,
      timeChrist: timeLine?.timeChrist === 'A.C.' ? 0 : 1,
    })

    const { fullDate } = this.dateProvider.getDateByTimestamp(timestamp)

    const newProject = await this.projectsRepository.create({
      name,
      private: priv,
      features_using: featuresListInLine,
      type,
      password,
      user_id: userId,
      initial_date: timeLine && fullDate,
      initial_date_time_christ: timeLine?.timeChrist,
      initial_date_timestamp: timeLine ? timestamp.toString() : '0',
      users_with_access_comment: {
        create: {},
      },
      users_with_access_edit: {
        create: {},
      },
      users_with_access_view: {
        create: {},
      },
      timeLines: timeLine && {
        create: {
          user_id: userId,
          is_alternative: false,
        },
      },
    })

    await this.usersRepository.removeCacheOfUser(userId)
    if (!newProject) {
      return {
        ok: false,
        error: makeErrorProjectNotCreated(),
      }
    }

    return {
      ok: true,
    }
  }
}
