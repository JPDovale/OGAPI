import { inject, injectable } from 'tsyringe'

import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO'
import { type User } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { prisma } from '@shared/infra/database/createConnection'

import { type IUsersRepository } from '../../repositories/contracts/IUsersRepository'
import {
  type IUserUnchecked,
  type IUser,
} from '../../repositories/entities/IUser'
import { type IListUsers } from '../../repositories/types/IListUsers'

@injectable()
export class UsersPrismaRepository implements IUsersRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  private async setUserInCache(user: IUser): Promise<void> {
    await this.cacheProvider.setInfo<IUser>(
      {
        key: 'user',
        objectId: user.id,
      },
      user,
      60 * 60 * 24, // 1 day
    )
  }

  private async getUserInCache(userId: string): Promise<IUser | null> {
    return await this.cacheProvider.getInfo<IUser>({
      key: 'user',
      objectId: userId,
    })
  }

  async removeCacheOfUser(userId: string): Promise<void> {
    await this.cacheProvider.delete({
      key: 'user',
      objectId: userId,
    })
  }

  async createMany(dataManyUsers: ICreateManyUsersDTO): Promise<void> {
    await prisma.user.createMany({
      data: dataManyUsers,
    })
  }

  async listAllIds(): Promise<Array<{ id: string }>> {
    const allIds = await prisma.user.findMany({
      select: {
        id: true,
      },
    })

    return allIds
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        notifications: true,
        subscription: true,
        _count: {
          select: {
            projects: true,
            notifications: true,
            boxes: true,
            books: true,
          },
        },
      },
    })

    if (user) {
      this.setUserInCache(user).catch((err) => {
        throw err
      })
    }

    return user
  }

  async list({ page }: IListUsers): Promise<IUserUnchecked[]> {
    const perPage = 20
    const skip = (page - 1) * 20

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        admin: true,
        name: true,
        avatar_url: true,
        subscription: true,
        _count: {
          select: {
            projects: true,
            projectUsersComment: true,
            projectUsersEdit: true,
            projectUsersView: true,
            notifications: true,
          },
        },
      },

      skip,
      take: perPage,
    })

    return users
  }

  async create(data: ICreateUserDTO): Promise<User | null> {
    const user = await prisma.user.create({
      data,
      include: {
        notifications: true,
        subscription: true,
        _count: {
          select: {
            projects: true,
            notifications: true,
            boxes: true,
            books: true,
          },
        },
      },
    })

    if (user) {
      this.setUserInCache(user).catch((err) => {
        throw err
      })
    }

    return user
  }

  async findById(id: string): Promise<IUser | null> {
    const userInCache = await this.getUserInCache(id)
    if (userInCache) return userInCache

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        notifications: true,
        subscription: true,
        _count: {
          select: {
            projects: true,
            notifications: true,
            boxes: true,
            books: true,
          },
        },
      },
    })

    if (user) {
      this.setUserInCache(user).catch((err) => {
        throw err
      })
    }

    return user
  }

  async delete(id: string): Promise<void> {
    await Promise.all([
      prisma.user.delete({
        where: {
          id,
        },
      }),

      this.cacheProvider.delete({
        key: 'user',
        objectId: id,
      }),
    ]).catch((err) => {
      throw err
    })
  }

  async updateUser({ userId, data }: IUpdateUserDTO): Promise<IUser | null> {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      include: {
        notifications: true,
        subscription: true,
        _count: {
          select: {
            projects: true,
            notifications: true,
            boxes: true,
            books: true,
          },
        },
      },
    })

    if (user) {
      this.setUserInCache(user).catch((err) => {
        throw err
      })
    }

    return user
  }

  async findManyById(ids: string[]): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        id: { in: ids },
      },
    })

    return users
  }

  async findByCustomerId(customerId: string): Promise<IUser | null> {
    const user = prisma.user.findUnique({
      where: {
        id_customer: customerId,
      },
      include: {
        subscription: true,
      },
    })

    return await user
  }
}
