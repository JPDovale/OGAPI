import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { ITimeLinesRepository } from '@modules/timelines/infra/repositories/contracts/ITimeLinesRepository'
import { type ITimeEvent } from '@modules/timelines/infra/repositories/entities/ITimeEvent'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorTimeLineNotCreated } from '@shared/errors/timelines/makeErrorTimeLineNotCreated'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  projectId: string
  initialDate: number
  timeChrist: 'A.C.' | 'D.C.'
}

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

    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,
  ) {}

  async execute({
    initialDate,
    timeChrist,
    projectId,
    userId,
  }: IRequest): Promise<IResolve> {
    const verification = await this.verifyPermissions.verify({
      projectId,
      userId,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['timeLines'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const { project } = verification.data!

    const mainTimeLineProject =
      await this.timeLinesRepository.findMainOfProject(projectId)

    const initialDateTimestamp = this.dateProvider.getTimestamp({
      year: initialDate,
      timeChrist: timeChrist === 'A.C.' ? 0 : 1,
    })

    const { fullDate, year } =
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
        is_alternative: false,
      })

      if (!timeLineCreated) throw makeErrorTimeLineNotCreated()

      const promises: Array<
        Promise<ITimeEvent | null> | Promise<IPerson | null>
      > = []

      personsOfProject.map((person) => {
        const happenedDateTimestamp = this.dateProvider.removeYears(
          initialDateTimestamp,
          person.age,
        )
        const { year, fullDate, day, hour, minute, month, second } =
          this.dateProvider.getDateByTimestamp(happenedDateTimestamp)

        promises.push(
          this.personsRepository.updatePerson({
            personId: person.id,
            data: {
              born_date: fullDate,
              born_year: year.label,
              born_year_time_christ: fullDate.includes('-') ? 'A.C.' : 'D.C.',
              born_month: month.label,
              born_day: day.value,
              born_hour: hour.value,
              born_minute: minute.value,
              born_second: second.value,
              born_date_timestamp: happenedDateTimestamp.toString(),
            },
          }),
        )

        return promises.push(
          this.timeEventsRepository.create({
            title: `Nasce ${person.name} ${person.last_name}`,
            description: `Nesse dia ${person.name} ${person.last_name} nascia`,
            time_line_id: timeLineCreated.id,
            happened_year: year.label,
            happened_year_time_christ: fullDate.includes('-') ? 'A.C.' : 'D.C.',
            happened_month: month.label,
            happened_day: day.value,
            happened_hour: hour.value,
            happened_minute: minute.value,
            happened_second: second.value,
            happened_date: fullDate,
            happened_date_timestamp: happenedDateTimestamp.toString(),
            timeEventBorn: {
              create: {
                person_id: person.id,
              },
            },
          }),
        )
      })

      await Promise.all(promises)
    } else {
      const oldDate = this.dateProvider.getDateByTimestamp(
        Number(project.initial_date_timestamp),
      )

      const timeEvents = mainTimeLineProject.timeEvents ?? []
      const persons = project.persons ?? []

      const diferenceBetweenDatesInYears = year.value - oldDate.year.value

      const promises: Array<
        Promise<ITimeEvent | null> | Promise<IPerson | null>
      > = []

      persons.map((person) => {
        const oldBornDateTimestamp = Number(person.born_date_timestamp)

        const newBornDateTimestamp = this.dateProvider.addYears(
          oldBornDateTimestamp,
          diferenceBetweenDatesInYears,
        )
        const newBornDate =
          this.dateProvider.getDateByTimestamp(newBornDateTimestamp)

        return promises.push(
          this.personsRepository.updatePerson({
            personId: person.id,
            data: {
              born_date: newBornDate.fullDate,
              born_date_timestamp: newBornDateTimestamp.toString(),
              born_year: newBornDate.year.label,
              born_year_time_christ: newBornDate.fullDate.includes('-')
                ? 'A.C.'
                : 'D.C.',
              born_month: newBornDate.month.label,
              born_day: newBornDate.day.value,
              born_hour: newBornDate.hour.value,
              born_minute: newBornDate.minute.value,
              born_second: newBornDate.second.value,
            },
          }),
        )
      })

      timeEvents.map((timeEvent) => {
        if (timeEvent.scene) return false

        const oldHappenedDateTimestamp = Number(
          timeEvent.happened_date_timestamp,
        )

        const newHappenedDateTimestamp = this.dateProvider.addYears(
          oldHappenedDateTimestamp,
          diferenceBetweenDatesInYears,
        )
        const newHappenedDate = this.dateProvider.getDateByTimestamp(
          newHappenedDateTimestamp,
        )

        return promises.push(
          this.timeEventsRepository.update({
            timeEventId: timeEvent.id,
            data: {
              happened_date: newHappenedDate.fullDate,
              happened_date_timestamp: newHappenedDateTimestamp.toString(),
              happened_year: newHappenedDate.year.label,
              happened_year_time_christ: newHappenedDate.fullDate.includes('-')
                ? 'A.C.'
                : 'D.C.',
              happened_month: newHappenedDate.month.label,
              happened_day: newHappenedDate.day.value,
              happened_hour: newHappenedDate.hour.value,
              happened_minute: newHappenedDate.minute.value,
              happened_second: newHappenedDate.second.value,
            },
          }),
        )
      })
    }

    return {
      ok: true,
    }
  }
}
