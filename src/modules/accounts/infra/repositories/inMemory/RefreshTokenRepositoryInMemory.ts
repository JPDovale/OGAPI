import { randomUUID } from 'node:crypto'

import { type ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'

import {
  type IFindByRefreshToken,
  type IRefreshTokenRepository,
} from '../contracts/IRefreshTokenRepository'
import { type IRefreshToken } from '../entities/IRefreshToken'

export class RefreshTokenRepositoryInMemory implements IRefreshTokenRepository {
  tokens: IRefreshToken[] = []

  async create(
    refreshToken: ICreateUserTokenDTO,
  ): Promise<IRefreshToken | null> {
    const token: IRefreshToken = {
      access_code: refreshToken.access_code ?? null,
      id: randomUUID(),
      application: refreshToken.application ?? 'OG-web',
      created_at: new Date(),
      expires_date: new Date(refreshToken.expires_date),
      refresh_token: refreshToken.refresh_token,
      user_id: refreshToken.user_id,
    }

    this.tokens.push(token)

    return token
  }

  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<IRefreshToken | null> {
    throw new Error('Method not implemented.')
  }

  async deleteById(refreshTokenId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async deletePerUserId(userId: string): Promise<void> {
    this.tokens = this.tokens.filter((token) => token.user_id !== userId)
  }

  async findByUserId(userId: string): Promise<IRefreshToken[]> {
    const tokens = this.tokens.filter((token) => token.user_id === userId)
    return tokens
  }

  async findByRefreshToken(
    query: IFindByRefreshToken,
  ): Promise<IRefreshToken | null> {
    throw new Error('Method not implemented.')
  }
}
