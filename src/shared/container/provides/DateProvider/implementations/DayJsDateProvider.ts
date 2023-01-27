import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'

import { injectable } from 'tsyringe'

import { IDateProvider, IIsBefore } from '../IDateProvider'

dayjs.extend(utc)
dayjs.locale('pt-br')

@injectable()
export class DayJsDateProvider implements IDateProvider {
  constructor() {
    dayjs.extend(utc)
    dayjs.locale('pt-br')
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate()
  }

  getDate(date: Date): string {
    const formattedDate = dayjs(date).format('DD/MM/YYYY [às] HH:mm')
    return formattedDate
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate()
  }

  isBefore({ startDate, endDate }: IIsBefore): boolean {
    return dayjs(startDate).isBefore(endDate)
  }
}
