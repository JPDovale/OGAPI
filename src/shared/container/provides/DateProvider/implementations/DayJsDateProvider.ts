import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { IDateProvider } from '../IDateProvider'

dayjs.extend(utc)

export class DayJsDateProvider implements IDateProvider {
  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate()
  }

  getDate(date: Date): string {
    const formattedDate = dayjs(date).format('DD/MM/YYYY HH:mm')
    const dateString = `${formattedDate.split(' ')[0]} às ${
      formattedDate.split(' ')[1]
    }`
    return dateString
  }
}
