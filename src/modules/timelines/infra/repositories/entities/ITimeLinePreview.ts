export interface ITimeLinePreview {
  created_at: Date
  is_alternative: boolean
  description: string
  title: string
  _count: {
    timeEvents: number
  }
}
