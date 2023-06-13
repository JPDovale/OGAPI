import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { type ITimeLine } from '@modules/timelines/infra/repositories/entities/ITimeLine'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotCreated } from '@shared/errors/persons/makeErrorPersonNotCreated'
import { makeErrorTimeLineNeedConfigurations } from '@shared/errors/timelines/makeErrorNeedConfigurations'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
import { getFeatures } from '@utils/application/dataTransformers/projects/features'

interface IRequest {
  userId: string
  projectId: string
  name: string
  lastName: string
  history: string
  age: number | null
  bornMonth: number
  bornDay: number
  bornHour: number
  bornMinute: number
  bornSecond: number
}

interface IResponse {
  person: IPerson
}

@injectable()
export class CreatePersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Providers.DateProvider)
    private readonly dateProvider: IDateProvider,

    @inject(InjectableDependencies.Repositories.TimeEventsRepository)
    private readonly timeEventsRepository: ITimeEventsRepository,
  ) {}

  async execute({
    userId,
    projectId,
    age,
    history,
    lastName,
    name,
    bornDay,
    bornHour,
    bornMinute,
    bornMonth,
    bornSecond,
  }: IRequest): Promise<IResolve<IResponse>> {
    const response = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['persons'],
    })

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    const { project, user } = response.data!

    const numberOfPersonsInProject = project._count?.persons ?? 0

    if (
      numberOfPersonsInProject >= 10 &&
      user.subscription?.payment_status !== 'active'
    ) {
      return {
        ok: false,
        error: makeErrorLimitFreeInEnd(),
      }
    }

    const { year } = this.dateProvider.getDateByTimestamp(
      Number(project.initial_date_timestamp),
    )

    const personBornYear = year.value - (age ?? 0)

    const personBornDateTimestamp = this.dateProvider.getTimestamp({
      year: personBornYear,
      month: bornMonth,
      day: bornDay,
      hour: bornHour,
      minute: bornMinute,
      second: bornSecond,
      timeChrist: personBornYear.toString().includes('-') ? 0 : 1,
    })

    const personBornDate = this.dateProvider.getDateByTimestamp(
      personBornDateTimestamp,
    )

    const featuresInProject = getFeatures(project.features_using)
    let mainTimeLine: ITimeLine | undefined

    if (featuresInProject.timeLines && age !== null) {
      const mainTimeLineProject = project.timeLines?.find(
        (timeLine) => !timeLine.is_alternative,
      )

      if (!mainTimeLineProject) {
        return {
          ok: false,
          error: makeErrorTimeLineNeedConfigurations(),
        }
      }

      mainTimeLine = mainTimeLineProject
    }

    const person = await this.personsRepository.create({
      age,
      history,
      last_name: lastName,
      name,
      project_id: project.id,
      user_id: user.id,
      born_date: personBornDate.fullDate,
      born_date_timestamp: personBornDateTimestamp.toString(),
      born_year: personBornDate.year.label,
      born_year_time_christ: personBornDate.fullDate.includes('-')
        ? 'A.C.'
        : 'D.C.',
      born_month: personBornDate.month.label,
      born_day: personBornDate.day.value,
      born_hour: personBornDate.hour.value,
      born_minute: personBornDate.minute.value,
      born_second: personBornDate.second.value,
    })

    if (!person) {
      return {
        ok: false,
        error: makeErrorPersonNotCreated(),
      }
    }

    if (mainTimeLine) {
      await this.timeEventsRepository.create({
        title: `Nasce ${name} ${lastName}`,
        description: `Nesse dia ${name} ${lastName} nascia`,
        happened_date: personBornDate.fullDate,
        happened_date_timestamp: personBornDateTimestamp.toString(),
        happened_year: personBornDate.year.label,
        happened_year_time_christ: personBornDate.fullDate.includes('-')
          ? 'A.C.'
          : 'D.C.',
        happened_month: personBornDate.month.label,
        happened_day: personBornDate.day.value,
        happened_hour: personBornDate.hour.value,
        happened_minute: personBornDate.minute.value,
        happened_second: personBornDate.second.value,
        time_line_id: mainTimeLine.id,
        timeEventBorn: {
          create: {
            person: {
              connect: {
                id: person.id,
              },
            },
          },
        },
      })
    }

    return {
      ok: true,
      data: {
        person,
      },
    }
  }
}
