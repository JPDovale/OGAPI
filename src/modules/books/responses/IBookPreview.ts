export interface IBookPreview {
  title: string
  subtitle: string
  literary_genre: string
  words: number
  written_words: number
  id: string
  created_at: Date
  updated_at: Date
  isbn: string
  front_cover_url: string | null
  _count: {
    genres: number
    authors: number
    capitules: number
    comments: number
  }
}
