import { type ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'
import { type RefreshToken } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import {
  type IFindByRefreshToken,
  type IRefreshTokenRepository,
} from '../../repositories/contracts/IRefreshTokenRepository'

export class RefreshTokensPrismaRepository implements IRefreshTokenRepository {
  async create(
    refreshToken: ICreateUserTokenDTO,
  ): Promise<RefreshToken | null> {
    const refreshTokenCreated = await prisma.refreshToken.create({
      data: refreshToken,
    })

    return refreshTokenCreated
  }

  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken | null> {
    const token = await prisma.refreshToken.findFirst({
      where: {
        user_id: userId,
        refresh_token: refreshToken,
      },
    })

    return token
  }

  async deleteById(refreshTokenId: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: {
        id: refreshTokenId,
      },
    })
  }

  async deletePerUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        user_id: userId,
      },
    })
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        user_id: userId,
      },
    })

    return tokens
  }

  async findByRefreshToken({
    refreshToken,
  }: IFindByRefreshToken): Promise<RefreshToken | null> {
    const token = await prisma.refreshToken.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    })

    return token
  }
}
