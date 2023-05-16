import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeEvent } from '@modules/timelines/infra/repositories/entities/ITimeEvent'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeLineNotCreated } from '@shared/errors/timelines/makeErrorTimeLineNotCreated'

interface IRequest {
  userId: string
  projectId: string
  initialDate: number
  timeChrist: 'A.C.' | 'D.C.'
}

type IResponse = Promise<void>

@injectable()
export class UpdateInitialDateUseCase {
  constructor(
    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.TimeLinesRepository)
    private readonly timeLinesRepository: ITimeLinesRepository,

    @inject(InjectableDependencies.Repositories.ProjectsRepository)
    private readonly projectsRepository: IProjectsRepository,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,

    @inject(InjectableDependencies.Repositories.TimeEventsRepository)
    private readonly timeEventsRepository: ITimeEventsRepository,
  ) {}

  async execute({
    initialDate,
    timeChrist,
    projectId,
    userId,
  }: IRequest): IResponse {
    const { project } = await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['timeLines'],
    })

    const mainTimeLineProject =
      await this.timeLinesRepository.findMainOfProject(projectId)

    const initialDateTimestamp = this.dateProvider.getTimestamp({
      year: initialDate,
      timeChrist: timeChrist === 'A.C.' ? 0 : 1,
    })

    const { fullDate } =
      this.dateProvider.getDateByTimestamp(initialDateTimestamp)

    await this.projectsRepository.update({
      projectId,
      data: {
        initial_date: fullDate,
        initial_date_time_christ: timeChrist,
        initial_date_timestamp: initialDateTimestamp.toString(),
      },
    })

    if (!mainTimeLineProject) {
      const personsOfProject = project.persons ?? []

      const timeLineCreated = await this.timeLinesRepository.create({
        project_id: projectId,
        user_id: userId,
      })

      if (!timeLineCreated) throw makeErrorTimeLineNotCreated()

      const promises: Array<Promise<ITimeEvent | null>> = []

      personsOfProject.map((person) => {
        const happenedDateTimestamp = this.dateProvider.removeYears(
          initialDateTimestamp,
          person.age,
        )
        const { year, fullDate } = this.dateProvider.getDateByTimestamp(
          happenedDateTimestamp,
        )

        return promises.push(
          this.timeEventsRepository.create({
            title: `Nasce ${person.name} ${person.last_name}`,
            description: `Nesse dia ${person.name} ${person.last_name} nascia`,
            time_line_id: timeLineCreated.id,
            happened_year: year.label,
            happened_year_time_christ: fullDate.includes('-') ? 'A.C.' : 'D.C.',
            happened_month: '0',
            happened_day: 1,
            happened_hour: 0,
            happened_minute: 0,
            happened_second: 0,
            happened_date: fullDate,
            happened_date_timestamp: happenedDateTimestamp.toString(),
          }),
        )
      })

      await Promise.all(promises)
    } else {
      console.log('not-implemented')
    }
  }
}
