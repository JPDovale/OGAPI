import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'

import { type IAvatar } from '../../entities/Avatar'
import { type INotification } from '../../entities/Notification'
import { type IUserMongo, UserMongo } from '../../entities/User'
import { type IUsersRepository } from '../IUsersRepository'

@injectable()
export class UsersMongoRepository implements IUsersRepository {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async create(
    dataUserObj: ICreateUserDTO,
  ): Promise<IUserMongo | null | undefined> {
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
      payed,
      admin,
    } = dataUserObj

    const mocUser = new UserMongo({
      id: uuidV4(),
      name,
      email,
      age,
      password,
      sex,
      username,
      isInitialized: isInitialized ?? false,
      isSocialLogin: isSocialLogin ?? false,
      code,
      avatar,
      payed: payed ?? false,
      admin: admin ?? false,
      createAt: this.dateProvider.getDate(new Date()),
      updateAt: this.dateProvider.getDate(new Date()),
      notifications: [],
    })

    const user = await mocUser.save()

    return user
  }

  async list(): Promise<IUserMongo[]> {
    const users = await UserMongo.find()

    return users
  }

  async findByEmail(email: string): Promise<IUserMongo | null | undefined> {
    const user = await UserMongo.findOne({ email })

    return user
  }

  async findById(id: string): Promise<IUserMongo | null | undefined> {
    const user = await UserMongo.findOne({ id })
    return user
  }

  async delete(id: string): Promise<void> {
    await UserMongo.deleteOne({ id })
  }

  async updateAvatar(
    id: string,
    avatar: IAvatar,
  ): Promise<IUserMongo | null | undefined> {
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
  ): Promise<IUserMongo | null | undefined> {
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

  async findByUsername(
    username: string,
  ): Promise<IUserMongo | null | undefined> {
    const userExiste = await UserMongo.findOne({ username })
    return userExiste
  }

  async findByCode(code: string): Promise<IUserMongo | null | undefined> {
    const userExiste = await UserMongo.findOne({ code })
    return userExiste
  }

  async getUser(
    id: string,
    updatedInfos: ICreateUserDTO,
  ): Promise<IUserMongo | null | undefined> {
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
