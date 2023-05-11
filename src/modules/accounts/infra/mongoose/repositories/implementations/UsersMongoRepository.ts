import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO'
import { type IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { type IUpdateAvatar } from '@modules/accounts/infra/repositories/types/IUpdateAvatar'
import { type Prisma } from '@prisma/client'

import { UserMongo } from '../../entities/User'

export class UsersMongoRepository implements IUsersRepository {
  async listAllIds(): Promise<Array<{ id: string }>> {
    throw new Error('Method not implemented.')
  }

  async createMany(dataManyUsers: ICreateManyUsersDTO): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findByEmail(email: string): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }

  async list(): Promise<IUser[]> {
    const users = await UserMongo.find()

    return users as unknown as IUser[]
  }

  async create(dataUserObj: Prisma.UserCreateInput): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }

  async findById(userId: string): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async updateAvatar(avatarProps: IUpdateAvatar): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }

  async updateUser(userToUpdate: IUpdateUserDTO): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyById(ids: string[]): Promise<IUser[]> {
    throw new Error('Method not implemented.')
  }

  async visualizeNotifications(userId: string): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }
}
