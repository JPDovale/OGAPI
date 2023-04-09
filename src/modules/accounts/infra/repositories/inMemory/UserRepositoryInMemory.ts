import { randomUUID } from 'node:crypto'

import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'

import { type IUsersRepository } from '../contracts/IUsersRepository'
import { type IUser } from './../entities/IUser'

export class UserRepositoryInMemory implements IUsersRepository {
  users: IUser[] = []

  async findByEmail(email: string): Promise<IUser | null | undefined> {
    const user = this.users.find((user) => user.email === email)
    return user
  }

  async list(): Promise<IUser[]> {
    const users = this.users

    return users
  }

  async findById(userId: string): Promise<IUser | null | undefined> {
    const user = this.users.find((user) => user.id === userId)
    return user
  }

  async create(dataUserObj: ICreateUserDTO): Promise<IUser | null | undefined> {
    const {
      name,
      email,
      age,
      password,
      sex,
      username,
      avatar_filename,
      avatar_url,
      code,
      isSocialLogin,
      lastPaymentDate,
      admin,
    } = dataUserObj

    const newUser: IUser = {
      id: randomUUID(),
      name,
      email,
      age,
      password,
      sex,
      username,
      avatar_filename: avatar_filename ?? null,
      avatar_url: avatar_url ?? null,
      code: code ?? null,
      is_social_login: isSocialLogin ?? false,
      last_payment_date: lastPaymentDate ?? null,
      admin: admin ?? false,
      created_at: new Date(),
    }

    this.users.push(newUser)
    return newUser
  }

  async delete(id: string): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    this.users = filteredUsers
  }

  async updateAvatar(
    userId: string,
    
  ): Promise<IUser | null | undefined> {
    const filteredUsers = this.users.filter((user) => user.id !== userId)
    const user = this.users.find((user) => user.id === userId)
    if (!user) return undefined

    const userToUpdate = user.toObject()

    const updatedUser: IUser = { ...userToUpdate, avatar }

    this.users = [...filteredUsers, updatedUser]

    return updatedUser
  }

  async updateUser(
    id: string,
    username: string,
    name: string,
    email: string,
    age: string,
    sex: string,
  ): Promise<IUser | null | undefined> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    const user = this.users.find((user) => user.id === id)

    if (!user) return undefined

    const userToUpdate = user.toObject()

    const updatedUser: IUser = {
      ...userToUpdate,
      username,
      email,
      age,
      sex,
      name,
    }

    this.users = [...filteredUsers, updatedUser]

    return updatedUser
  }

  async findByUsername(username: string): Promise<IUser | null | undefined> {
    const user = this.users.find((user) => user.username === username)
    return user
  }

  async findByCode(code: string): Promise<IUser | null | undefined> {
    const user = this.users.find((user) => user.code === code)
    return user
  }

  async getUser(
    id: string,
    updatedInfos: ICreateUserDTO,
  ): Promise<IUser | null | undefined> {
    const {
      age,
      email,
      name,
      password,
      sex,
      username,
      avatar,
      code,
      isInitialized,
    } = updatedInfos

    const filteredUsers = this.users.filter((user) => user.id !== id)
    const user = this.users.find((user) => user.id === id)

    if (!user) return undefined

    const userToUpdate = user.toObject()

    const updatedUser: IUser = {
      ...userToUpdate,
      username: username ?? userToUpdate.username,
      email: email ?? userToUpdate.email,
      age: age ?? userToUpdate.age,
      sex: sex ?? userToUpdate.sex,
      name: name ?? userToUpdate.name,
      avatar: avatar ?? userToUpdate.avatar,
      password: password ?? userToUpdate.password,
      code,
      isInitialized: isInitialized ?? userToUpdate.isInitialized,
    }

    this.users = [...filteredUsers, updatedUser]
    return updatedUser
  }

  async updateNotifications(
    id: string,
    notifications: INotification[],
  ): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    const user = this.users.find((user) => user.id === id)

    if (!user) return undefined

    const userToUpdate = user.toObject()

    const updatedUser: IUser = { ...userToUpdate, notifications }
    this.users = [...filteredUsers, updatedUser]
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    const user = this.users.find((user) => user.id === id)

    if (!user) return undefined

    const userToUpdate = user.toObject()

    const updatedUser: IUser = { ...userToUpdate, password }

    this.users = [...filteredUsers, updatedUser]
  }

  async findManyById(ids: string[]): Promise<IUser[]> {
    const users = this.users.filter((user) => {
      const userIn = ids.find((id) => user.id === id)

      return !!userIn
    })

    return users
  }

  async updateNotificationManyById(
    ids: string[],
    notification: INotification,
  ): Promise<void> {
    const updatedUsers = this.users.map((user) => {
      const userIn = ids.find((id) => user.id === id)

      if (userIn) {
        const userToNotify = user.toObject()

        const updatedUser: IUser = {
          ...userToNotify,
          notifications: [{ ...notification }, ...userToNotify.notifications],
        }

        return updatedUser
      }

      return user
    })

    this.users = updatedUsers
  }
}
