import { v4 as uuidV4 } from 'uuid'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { INotification } from '@modules/accounts/infra/mongoose/entities/Notification'
import {
  IUserMongo,
  UserMongo,
} from '@modules/accounts/infra/mongoose/entities/User'

import { IUsersRepository } from '../IUsersRepository'

export class UserRepositoryInMemory implements IUsersRepository {
  users: IUserMongo[] = []

  async findByEmail(email: string): Promise<IUserMongo> {
    const user = this.users.find((user) => user.email === email)
    return user
  }

  async list(): Promise<IUserMongo[]> {
    const users = this.users

    return users
  }

  async findById(userId: string): Promise<IUserMongo> {
    const user = this.users.find((user) => user.id === userId)

    return user
  }

  async create(dataUserObj: ICreateUserDTO): Promise<IUserMongo> {
    const {
      name,
      email,
      age,
      password,
      sex,
      username,
      avatar,
      code,
      isInitialized,
      isSocialLogin,
    } = dataUserObj

    const newUser = new UserMongo({
      id: uuidV4(),
      name,
      email,
      age,
      password,
      sex,
      username,
      avatar,
      code,
      isInitialized,
      isSocialLogin,
    })

    this.users.push(newUser)
    return newUser
  }

  async delete(id: string): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    this.users = filteredUsers
  }

  async updateAvatar(userId: string, avatar: IAvatar): Promise<IUserMongo> {
    const filteredUsers = this.users.filter((user) => user.id !== userId)
    const userToUpdate = this.users.find((user) => user.id === userId)

    const updatedUser: IUserMongo = { ...userToUpdate, avatar }

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
  ): Promise<IUserMongo> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    const userToUpdate = this.users.find((user) => user.id === id)

    const updatedUser: IUserMongo = {
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

  async findByUsername(username: string): Promise<IUserMongo> {
    const user = this.users.find((user) => user.username === username)
    return user
  }

  async findByCode(code: string): Promise<IUserMongo> {
    const user = this.users.find((user) => user.code === code)
    return user
  }

  async getUser(id: string, updatedInfos: ICreateUserDTO): Promise<IUserMongo> {
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
    const userToUpdate = this.users.find((user) => user.id === id)

    const updatedUser: IUserMongo = {
      ...userToUpdate,
      username: username || userToUpdate.username,
      email: email || userToUpdate.email,
      age: age || userToUpdate.age,
      sex: sex || userToUpdate.sex,
      name: name || userToUpdate.name,
      avatar: avatar || userToUpdate.avatar,
      password: password || userToUpdate.password,
      code,
      isInitialized,
    }

    this.users = [...filteredUsers, updatedUser]
    return updatedUser
  }

  async updateNotifications(
    id: string,
    notifications: INotification[],
  ): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    const userToUpdate = this.users.find((user) => user.id === id)

    const updatedUser: IUserMongo = { ...userToUpdate, notifications }
    this.users = [...filteredUsers, updatedUser]
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    const userToUpdate = this.users.find((user) => user.id === id)

    const updatedUser: IUserMongo = { ...userToUpdate._doc, password }

    this.users = [...filteredUsers, updatedUser]
  }

  findManyById: (ids: string[]) => Promise<IUserMongo[]>

  async updateNotificationManyById(
    ids: string[],
    notification: INotification,
  ): Promise<void> {
    const updatedUsers = this.users.map((user) => {
      const userIn = ids.find((id) => user.id === id)

      if (userIn) {
        const updatedUser: IUserMongo = {
          ...user._doc,
          notifications: [{ ...notification }, ...user.notifications],
        }

        return updatedUser
      }

      return user
    })

    this.users = updatedUsers
  }
}
