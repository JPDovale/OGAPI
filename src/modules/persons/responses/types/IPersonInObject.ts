export interface IPersonInObject {
  id: string
  name: {
    first: string
  }
  image: {
    url: string | undefined
    alt: string
  }
}
