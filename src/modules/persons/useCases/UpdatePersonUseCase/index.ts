import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { ITimeEventsRepository } from '@modules/timelines/infra/repositories/contracts/ITimeEventsRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorTimeLineNeedConfigurations } from '@shared/errors/timelines/makeErrorNeedConfigurations'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'
import { getFeatures } from '@utils/application/dataTransformers/projects/features'

interface IRequest {
  userId: string
  personId: string
  name?: string
  lastName?: string
  history?: string
  age?: number | null
  bornMonth?: number
  bornDay?: number
  bornHour?: number
  bornMinute?: number
  bornSecond?: number
}

interface IResponse {
  person: IPerson
}

@injectable()
export class UpdatePersonUseCase {
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
    personId,
    userId,
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
    const personExite = await this.personsRepository.findById(personId)
    if (!personExite) {
      return {
        ok: false,
        error: makeErrorPersonNotFound(),
      }
    }

    const verification = await this.verifyPermissions.verify({
      userId,
      projectId: personExite.project_id,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['persons'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const { project } = verification.data!
    const features = getFeatures(project.features_using)

    const { year } = this.dateProvider.getDateByTimestamp(
      Number(project.initial_date_timestamp),
    )

    const personBornYear = year.value - (age ?? personExite.age ?? 0)

    const personBornDateTimestamp = this.dateProvider.getTimestamp({
      year: personBornYear,
      month: bornMonth ?? Number(personExite.born_month) - 1,
      day: bornDay ?? personExite.born_day,
      hour: bornHour ?? personExite.born_hour,
      minute: bornMinute ?? personExite.born_minute,
      second: bornSecond ?? personExite.born_second,
      timeChrist: personBornYear.toString().includes('-') ? 0 : 1,
    })

    const personBornDate = this.dateProvider.getDateByTimestamp(
      personBornDateTimestamp,
    )

    if (personExite.timeEventBorn?.timeEvent) {
      const timeEventId = personExite.timeEventBorn.timeEvent.id

      if (age === null) {
        await this.timeEventsRepository.delete(timeEventId)
      } else {
        await this.timeEventsRepository.update({
          timeEventId,
          data: {
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
          },
        })
      }
    }

    const updatedPerson = await this.personsRepository.updatePerson({
      personId,
      data: {
        age,
        history,
        name,
        last_name: lastName,
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
      },
    })
    if (!updatedPerson) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    if (
      !updatedPerson.timeEventBorn?.timeEvent &&
      age !== null &&
      features.timeLines
    ) {
      const mainTimeLineProject = project.timeLines?.find(
        (timeLine) => !timeLine.is_alternative,
      )

      if (!mainTimeLineProject) {
        return {
          ok: false,
          error: makeErrorTimeLineNeedConfigurations(),
        }
      }

      await this.timeEventsRepository.create({
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
        time_line_id: mainTimeLineProject.id,
        title: `Nasce ${updatedPerson.name} ${updatedPerson.last_name}`,
        description: `Nesse dia ${updatedPerson.name} ${updatedPerson.last_name} nascia`,
        timeEventBorn: {
          create: {
            person: {
              connect: {
                id: updatedPerson.id,
              },
            },
          },
        },
      })
    }

    return {
      ok: true,
      data: {
        person: updatedPerson,
      },
    }
  }
}
