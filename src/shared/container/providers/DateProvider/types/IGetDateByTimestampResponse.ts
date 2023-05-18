export interface IGetDateByTimestampResponse {
  fullDate: string
  year: {
    value: number
    label: string
  }
  month: {
    value: number
    label: string
  }
  day: {
    value: number
    label: string
  }
  hour: {
    value: number
    label: string
  }
  minute: {
    value: number
    label: string
  }
  second: {
    value: number
    label: string
  }
}
