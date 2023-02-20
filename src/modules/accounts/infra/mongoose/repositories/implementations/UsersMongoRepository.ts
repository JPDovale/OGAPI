import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'

import { IAvatar } from '../../entities/Avatar'
import { INotification } from '../../entities/Notification'
import { IUserMongo, UserMongo } from '../../entities/User'
import { IUsersRepository } from '../IUsersRepository'

@injectable()
export class UsersMongoRepository implements IUsersRepository {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async create(dataUserObj: ICreateUserDTO): Promise<IUserMongo> {
    const {
      name,
      email,
      age,
      password,
      sex,
      username,
      isInitialized,
      isSocialLogin,
      code,
      avatar,
    } = dataUserObj

    const mocUser = new UserMongo({
      id: uuidV4(),
      name,
      email,
      age,
      password,
      sex,
      username,
      isInitialized,
      isSocialLogin,
      code,
      avatar,
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

  async updateUser(
    id: string,
    username: string,
    name: string,
    email: string,
    age: string,
    sex: string,
  ): Promise<IUserMongo> {
    await UserMongo.findOneAndUpdate(
      { id },
      {
        username,
        name,
        email,
        age,
        sex,
        updateAt: this.dateProvider.getDate(new Date()),
      },
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

  async updatePassword(id: string, password: string): Promise<void> {
    await UserMongo.findOneAndUpdate(
      { id },
      { password, updateAt: this.dateProvider.getDate(new Date()) },
    )
  }

  async findManyById(ids: string[]): Promise<IUserMongo[]> {
    const usersIds = ids.map((id) => {
      return {
        id,
      }
    })

    const users = await UserMongo.find({ $or: [...usersIds] })

    return users
  }

  async updateNotificationManyById(
    ids: string[],
    notification: INotification,
  ): Promise<void> {
    await UserMongo.updateMany(
      {
        id: { $in: ids },
      },
      { $push: { notifications: { $each: [notification], $position: -1 } } },
    )
  }
}
