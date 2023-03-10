import { IAvatar } from '../infra/mongoose/entities/Avatar'

export interface ICreateUserDTO {
  name: string
  email: string
  password: string
  sex: string
  age: string
  username: string
  isInitialized?: boolean
  isSocialLogin?: boolean
  code?: string
  avatar?: IAvatar
  payed?: boolean
}
