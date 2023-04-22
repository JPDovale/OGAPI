import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO'
import { type IUserPreview } from '@modules/accounts/responses/IUserPreview'

import { type IUser } from '../entities/IUser'
import { type IUpdateAvatar } from '../types/IUpdateAvatar'

export abstract class IUsersRepository {
  abstract findByEmail(email: string): Promise<IUser | null>
  abstract getPreviewUser(userId: string): Promise<IUserPreview | null>
  abstract list(): Promise<IUser[]>
  abstract create(dataUserObj: ICreateUserDTO): Promise<IUser | null>
  abstract createMany(dataManyUsers: ICreateManyUsersDTO): Promise<void>
  abstract findById(userId: string): Promise<IUser | null>
  abstract delete(id: string): Promise<void>
  abstract updateAvatar(avatarProps: IUpdateAvatar): Promise<IUser | null>
  abstract updateUser(userToUpdate: IUpdateUserDTO): Promise<IUser | null>
  abstract updatePassword(userId: string, password: string): Promise<void>
  abstract findManyById(ids: string[]): Promise<IUser[]>
  abstract visualizeNotifications(userId: string): Promise<IUser | null>
  abstract listAllIds(): Promise<Array<{ id: string }>>
}
