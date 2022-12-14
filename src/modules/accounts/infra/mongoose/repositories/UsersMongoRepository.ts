import { v4 as uuidV4 } from 'uuid'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'

import { IUserMongo, UserMongo } from '../entities/User'

export class UsersMongoRepository implements IUsersRepository {
  async create(dataUserObj: ICreateUserDTO): Promise<IUserMongo> {
    const { name, email, age, password, sex, username } = dataUserObj

    if (!name || !email || !password) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      const mocUser = new UserMongo({
        id: uuidV4(),
        name,
        email,
        age,
        password,
        sex,
        username,
      })

      const user = await mocUser.save()

      return user
    } catch (err) {
      throw new AppError('Internal error', 500)
    }
  }

  async list(): Promise<IUserMongo[]> {
    const users = await UserMongo.find()

    return users
  }

  async findByEmail(email: string): Promise<IUserMongo> {
    if (!email) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      const user = await UserMongo.findOne({ email })

      return user
    } catch (err) {
      throw new AppError('Internal error', 500)
    }
  }

  async findById(userId: string): Promise<IUserMongo> {
    if (!userId) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      const user = await UserMongo.findOne({ id: userId })
      return user
    } catch (err) {
      throw new AppError('Internal error', 500)
    }
  }

  async delete(userId: string): Promise<void> {
    if (!userId) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      await UserMongo.deleteOne({ id: userId })
    } catch (err) {
      throw new AppError('Internal error', 500)
    }
  }

  async updateAvatar(userId: string, url: string): Promise<void> {
    if (!userId || !url) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      await UserMongo.findOneAndUpdate({ id: userId }, { avatar: url })
    } catch (err) {
      throw new AppError('Internal error', 500)
    }
  }
}
