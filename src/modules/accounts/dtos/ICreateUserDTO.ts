export interface ICreateUserDTO {
  name: string
  email: string
  password: string
  sex: string
  age: string
  username: string
  isInitialized?: boolean
  code?: string
}
