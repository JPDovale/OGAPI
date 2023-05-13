import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO'

import { type IUser } from '../entities/IUser'

export abstract class IUsersRepository {
  abstract findByEmail(email: string): Promise<IUser | null>
  abstract list(): Promise<IUser[]>
  abstract create(dataUserObj: ICreateUserDTO): Promise<IUser | null>
  abstract createMany(dataManyUsers: ICreateManyUsersDTO): Promise<void>
  abstract findById(userId: string): Promise<IUser | null>
  abstract delete(id: string): Promise<void>
  abstract updateUser(userToUpdate: IUpdateUserDTO): Promise<IUser | null>
  abstract findManyById(ids: string[]): Promise<IUser[]>
  abstract listAllIds(): Promise<Array<{ id: string }>>
  abstract findByCustomerId(customerId: string): Promise<IUser | null>
  abstract removeCacheOfUser(userId: string): Promise<void>
}
