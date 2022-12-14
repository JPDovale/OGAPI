import { ICreateUserDTO } from '../dtos/ICreateUserDTO'
import { IUserMongo } from '../infra/mongoose/entities/User'

export interface IUsersRepository {
  findByEmail: (email: string) => Promise<IUserMongo>
  list: () => Promise<IUserMongo[]>
  create: (dataUserObj: ICreateUserDTO) => Promise<IUserMongo>
  findById: (userId: string) => Promise<IUserMongo>
  delete: (id: string) => Promise<void>
  updateAvatar: (userId: string, url: string) => Promise<void>
}
