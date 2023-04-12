import { randomUUID } from 'node:crypto'

import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO'

import { type IUsersRepository } from '../contracts/IUsersRepository'
import { type IUser } from '../entities/IUser'
import { type IUpdateAvatar } from '../types/IUpdateAvatar'

export class UserRepositoryInMemory implements IUsersRepository {
  users: IUser[] = []

  async findByEmail(email: string): Promise<IUser | null> {
    const user = this.users.find((user) => user.email === email)

    return user ?? null
  }

  async list(): Promise<IUser[]> {
    return this.users
  }

  async create(dataUserObj: ICreateUserDTO): Promise<IUser | null> {
    const user: IUser = {
      admin: dataUserObj.admin ?? false,
      age: dataUserObj.age ?? 'not-receipted',
      avatar_filename: dataUserObj.avatar_filename ?? null,
      avatar_url: dataUserObj.avatar_url ?? null,
      email: dataUserObj.email,
      id: randomUUID(),
      created_at: new Date(),
      is_social_login: dataUserObj.is_social_login ?? false,
      last_payment_date: dataUserObj.last_payment_date
        ? new Date(dataUserObj.last_payment_date)
        : null,
      name: dataUserObj.name,
      new_notifications: 0,
      password: dataUserObj.password,
      sex: dataUserObj.sex ?? 'not-receipted',
      username: dataUserObj.username,
    }

    this.users.push(user)

    return user
  }

  async createMany(dataManyUsers: ICreateManyUsersDTO): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(userId: string): Promise<IUser | null> {
    const user = this.users.find((user) => user.id === userId)

    return user ?? null
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id)
  }

  async updateAvatar(avatarProps: IUpdateAvatar): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }

  async updateUser(userToUpdate: IUpdateUserDTO): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    const indexOfUserToUpdate = this.users.findIndex(
      (user) => user.id === userId,
    )

    this.users[indexOfUserToUpdate] = {
      ...this.users[indexOfUserToUpdate],
      password,
    }
  }

  async findManyById(ids: string[]): Promise<IUser[]> {
    throw new Error('Method not implemented.')
  }

  async visualizeNotifications(userId: string): Promise<IUser | null> {
    throw new Error('Method not implemented.')
  }

  async listAllIds(): Promise<Array<{ id: string }>> {
    throw new Error('Method not implemented.')
  }
}
