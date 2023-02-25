export interface IIsBefore {
  startDate: Date
  endDate: Date
}

export interface IDateProvider {
  addDays: (days: number) => Date
  getDate: (date: Date) => string
  addHours: (hours: number) => Date
  removeHours: (hours: number, date: Date) => Date
  isBefore: ({ startDate, endDate }: IIsBefore) => boolean
}
