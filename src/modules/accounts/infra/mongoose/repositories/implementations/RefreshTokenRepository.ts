import {
  type IFindByRefreshToken,
  type IRefreshTokenRepository,
} from '@modules/accounts/infra/repositories/contracts/IRefreshTokenRepository'
import { type Prisma, type RefreshToken } from '@prisma/client'

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    refreshToken: Prisma.RefreshTokenUncheckedCreateInput,
  ): Promise<RefreshToken | null> {
    throw new Error('Method not implemented.')
  }

  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken | null> {
    throw new Error('Method not implemented.')
  }

  async deleteById(refreshTokenId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async deletePerUserId(userId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    throw new Error('Method not implemented.')
  }

  async findByRefreshToken(
    query: IFindByRefreshToken,
  ): Promise<RefreshToken | null> {
    throw new Error('Method not implemented.')
  }
}
