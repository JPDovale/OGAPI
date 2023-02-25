export interface ICreateBookDTO {
  title: string
  subtitle?: string
  createdPerUser: string
  authors: Array<{
    username?: string
    email?: string
    id?: string
  }>
  literaryGenere: string
  generes: Array<{ name?: string }>
  isbn?: string
  words?: string
  writtenWords?: string
}
