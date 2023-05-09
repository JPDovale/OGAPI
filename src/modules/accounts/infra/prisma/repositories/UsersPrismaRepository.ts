import { inject, injectable } from 'tsyringe'

import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO'
import { type User } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { prisma } from '@shared/infra/database/createConnection'

import { type IUsersRepository } from '../../repositories/contracts/IUsersRepository'
import { type IUser } from '../../repositories/entities/IUser'

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

  async list(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: { notifications: true, refreshTokens: true },
    })

    return users
  }

  async create(data: ICreateUserDTO): Promise<User | null> {
    const user = await prisma.user.create({
      data,
      include: {
        notifications: true,
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
}
