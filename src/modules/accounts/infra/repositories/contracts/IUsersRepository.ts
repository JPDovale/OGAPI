import { type ICreateAccountDTO } from '@modules/accounts/dtos/ICreateAccountDTO'
import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type ICreateSessionDTO } from '@modules/accounts/dtos/ICreateSessionDTO'
import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUpdateSessionDTO } from '@modules/accounts/dtos/IUpdateSessionDTO'
import { type IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO'

import { type IAccount } from '../entities/IAccount'
import { type ISession } from '../entities/ISession'
import { type IUserUnchecked, type IUser } from '../entities/IUser'
import { type IListUsers } from '../types/IListUsers'

export abstract class IUsersRepository {
  abstract createAccount(data: ICreateAccountDTO): Promise<IAccount | null>
  abstract createSession(data: ICreateSessionDTO): Promise<ISession | null>
  abstract findByEmail(email: string): Promise<IUser | null>
  abstract list(config: IListUsers): Promise<IUserUnchecked[]>
  abstract create(dataUserObj: ICreateUserDTO): Promise<IUser | null>
  abstract createMany(dataManyUsers: ICreateManyUsersDTO): Promise<void>
  abstract findById(userId: string): Promise<IUser | null>
  abstract delete(id: string): Promise<void>
  abstract updateUser(userToUpdate: IUpdateUserDTO): Promise<IUser | null>
  abstract findManyById(ids: string[]): Promise<IUser[]>
  abstract listAllIds(): Promise<Array<{ id: string }>>
  abstract findByCustomerId(customerId: string): Promise<IUser | null>
  abstract removeCacheOfUser(userId: string): Promise<void>
  abstract deleteSessionOfUser(userId: string): Promise<void>
  abstract updateSession(
    sessionToken: string,
    data: IUpdateSessionDTO,
  ): Promise<ISession | null>
  abstract findSessionByToken(sessionToken: string): Promise<ISession | null>
  abstract findByAccount(
    provider: string,
    providerAccountId: string,
  ): Promise<IUser | null>
}
