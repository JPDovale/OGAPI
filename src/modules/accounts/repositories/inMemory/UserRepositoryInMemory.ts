import { v4 as uuidV4 } from 'uuid'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
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
    const allUser = this.users.find((user) => user.id === userId)

    return allUser
  }

  async create(dataUserObj: ICreateUserDTO): Promise<IUserMongo> {
    const { name, email, age, password, sex, username } = dataUserObj

    const newUser = new UserMongo({
      id: uuidV4(),
      name,
      email,
      age,
      password,
      sex,
      username,
    })

    this.users.push(newUser)
    return newUser
  }

  async delete(id: string): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id)
    this.users = filteredUsers
  }
}
