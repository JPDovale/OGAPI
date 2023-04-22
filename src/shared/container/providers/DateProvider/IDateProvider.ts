export interface IIsBefore {
  startDate: Date
  endDate: Date
}

export abstract class IDateProvider {
  abstract addSeconds(seconds: number): Date
  abstract addDays(days: number): Date
  abstract getDate(date: Date): string
  abstract addHours(hours: number): Date
  abstract removeHours(hours: number, date: Date): Date
  abstract isBefore({ startDate, endDate }: IIsBefore): boolean
  abstract addDaysInDate(date: Date, days: number): Date
}
