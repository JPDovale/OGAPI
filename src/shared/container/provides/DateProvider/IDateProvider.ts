export interface IDateProvider {
  addDays: (days: number) => Date
  getDate: (date: Date) => string
}
