import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'

import { IAvatar } from '../entities/Avatar'
import { INotification } from '../entities/Notification'
import { IUserMongo, UserMongo } from '../entities/User'
@injectable()
export class UsersMongoRepository implements IUsersRepository {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async create(dataUserObj: ICreateUserDTO): Promise<IUserMongo> {
    const { name, email, age, password, sex, username, isInitialized, code } =
      dataUserObj

    const mocUser = new UserMongo({
      id: uuidV4(),
      name,
      email,
      age,
      password,
      sex,
      username,
      isInitialized,
      code,
    })

    const user = await mocUser.save()

    return user
  }

  async list(): Promise<IUserMongo[]> {
    const users = await UserMongo.find()

    return users
  }

  async findByEmail(email: string): Promise<IUserMongo> {
    const user = await UserMongo.findOne({ email })

    return user
  }

  async findById(id: string): Promise<IUserMongo> {
    const user = await UserMongo.findOne({ id })
    return user
  }

  async delete(id: string): Promise<void> {
    await UserMongo.deleteOne({ id })
  }

  async updateAvatar(id: string, avatar: IAvatar): Promise<IUserMongo> {
    await UserMongo.findOneAndUpdate(
      { id },
      { avatar, updateAt: this.dateProvider.getDate(new Date()) },
    )

    const updatedUser = await UserMongo.findOne({ id })
    return updatedUser
  }

  async updateUsername(id: string, username: string): Promise<IUserMongo> {
    await UserMongo.findOneAndUpdate(
      { id },
      { username, updateAt: this.dateProvider.getDate(new Date()) },
    )

    const updatedUser = await UserMongo.findOne({ id })
    return updatedUser
  }

  async findByUsername(username: string): Promise<IUserMongo> {
    const userExiste = await UserMongo.findOne({ username })
    return userExiste
  }

  async findByCode(code: string): Promise<IUserMongo> {
    const userExiste = await UserMongo.findOne({ code })
    return userExiste
  }

  async getUser(id: string, updatedInfos: ICreateUserDTO): Promise<IUserMongo> {
    await UserMongo.findOneAndUpdate({ id }, { ...updatedInfos })

    const getUser = await UserMongo.findOne({ id })
    return getUser
  }

  async updateNotifications(
    id: string,
    notifications: INotification[],
  ): Promise<void> {
    await UserMongo.findOneAndUpdate({ id }, { notifications })
  }
}
