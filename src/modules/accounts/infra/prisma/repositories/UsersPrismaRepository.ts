import { type ICreateManyUsersDTO } from '@modules/accounts/dtos/ICreateManyUsersDTO'
import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { type IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO'
import { type User } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IUsersRepository } from '../../repositories/contracts/IUsersRepository'
import { type IUser } from '../../repositories/entities/IUser'
import { type IUpdateAvatar } from '../../repositories/types/IUpdateAvatar'

export class UsersPrismaRepository implements IUsersRepository {
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

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        notifications: true,
      },
    })

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
    })

    return user
  }

  async findById(id: string): Promise<IUser | null> {
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
          },
        },
      },
    })

    return user
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async updateAvatar({
    userId,
    avatarFilename,
    avatarUrl,
  }: IUpdateAvatar): Promise<User | null> {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar_filename: avatarFilename,
        avatar_url: avatarUrl,
      },
      include: {
        notifications: true,
      },
    })

    return user
  }

  async updateUser({ userId, data }: IUpdateUserDTO): Promise<User | null> {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      include: {
        notifications: true,
      },
    })

    return user
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
      include: {
        notifications: true,
      },
    })
  }

  async findManyById(ids: string[]): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        notifications: true,
      },
    })

    return users
  }

  async visualizeNotifications(userId: string): Promise<IUser | null> {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        new_notifications: 0,
      },
      include: {
        notifications: true,
      },
    })

    return user
  }
}
