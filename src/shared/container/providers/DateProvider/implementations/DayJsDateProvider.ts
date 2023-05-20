import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'

import { injectable } from 'tsyringe'

import { type IDateProvider, type IIsBefore } from '../IDateProvider'
import { type IGetDateByTimestampResponse } from '../types/IGetDateByTimestampResponse'
import { type IGetTimestamp } from '../types/IGetTimestamp'

dayjs.extend(utc)
dayjs.locale('pt-br')

@injectable()
export class DayJsDateProvider implements IDateProvider {
  constructor() {
    dayjs.extend(utc)
    dayjs.locale('pt-br')
  }

  addSeconds(seconds: number): Date {
    return dayjs().add(seconds, 'seconds').toDate()
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate()
  }

  getDate(date: Date): string {
    const dateOfPtBr = this.removeHours(3, date)
    const formattedDate = dayjs(dateOfPtBr).format('DD/MM/YYYY [às] HH:mm')
    return formattedDate
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate()
  }

  removeHours(hours: number, date: Date): Date {
    return dayjs(date).subtract(hours, 'hour').toDate()
  }

  isBefore({ startDate, endDate }: IIsBefore): boolean {
    return dayjs(startDate).isBefore(endDate)
  }

  addDaysInDate(date: Date, days: number): Date {
    return dayjs(date).add(days, 'days').toDate()
  }

  getTimestamp(dateReceived: IGetTimestamp | Date): number {
    if (dateReceived instanceof Date) {
      return dayjs(dateReceived).utc().valueOf()
    }

    const {
      timeChrist,
      day = 1,
      hour = 0,
      minute = 0,
      month = 0,
      second = 0,
      year = 0,
    } = dateReceived

    const dateZero = dayjs('0000-01-01T00:00:00.001Z').utc()
    let finalDateTimestamp = 0

    const partiedYear = Math.abs(year)

    if (timeChrist === 0) {
      const newDateBeforeChrist = dayjs(dateZero)
        .utc()
        .subtract(partiedYear, 'year')
        .set('month', month)
        .set('date', day)
        .set('hour', hour)
        .set('minute', minute)
        .set('second', second)

      const timestampDateBeforeChrist = newDateBeforeChrist.valueOf()

      finalDateTimestamp = timestampDateBeforeChrist
    }

    if (timeChrist === 1) {
      const newDateAfterChrist = dayjs(dateZero)
        .add(partiedYear, 'year')
        .set('month', month)
        .set('date', day)
        .set('hour', hour)
        .set('minute', minute)
        .set('second', second)

      const timestampDateAfterChrist = newDateAfterChrist.valueOf()

      finalDateTimestamp = timestampDateAfterChrist
    }

    return finalDateTimestamp
  }

  getDateByTimestamp(timestamp: number): IGetDateByTimestampResponse {
    const date = dayjs(timestamp).utc().format('DD/MM/YYYY HH:mm:ss')

    const [fullDay, fullHour] = date.split(' ')
    const [day, month, year] = fullDay.split('/')
    const [hour, minute, second] = fullHour.split(':')

    return {
      fullDate: date,
      year: {
        label: year,
        value: Number(year),
      },
      month: {
        label: month,
        value: Number(month),
      },
      day: {
        label: day,
        value: Number(day),
      },
      hour: {
        label: hour,
        value: Number(hour),
      },
      minute: {
        label: minute,
        value: Number(minute),
      },
      second: {
        label: second,
        value: Number(second),
      },
    }
  }

  removeYears(date: number, years: number): number {
    return dayjs(date).utc().subtract(years, 'year').valueOf()
  }

  addYears(date: number, years: number): number {
    return dayjs(date).utc().add(years, 'years').valueOf()
  }
}
