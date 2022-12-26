import { v4 as uuidV4 } from 'uuid'

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'
import {
  IRefreshTokenMongo,
  RefreshTokenMongo,
} from '@modules/accounts/infra/mongoose/entities/RefreshToken'

import { IRefreshTokenRepository } from '../IRefreshTokenRepository'

export class RefreshTokenRepositoryInMemory implements IRefreshTokenRepository {
  userTokens: IRefreshTokenMongo[] = []

  async create({
    expiresDate,
    refreshToken,
    userId,
  }: ICreateUserTokenDTO): Promise<IRefreshTokenMongo> {
    const userToken = new RefreshTokenMongo({
      id: uuidV4(),
      userId,
      expiresDate,
      refreshToken,
    })

    this.userTokens.push(userToken)
    return userToken
  }

  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<IRefreshTokenMongo> {
    const userToken = this.userTokens.filter(
      (user) => user.userId === userId && user.refreshToken === refreshToken,
    )[0]
    return userToken
  }

  async deleteById(refreshTokenId: string): Promise<void> {
    const filteredTokens = this.userTokens.filter(
      (token) => token.id !== refreshTokenId,
    )

    this.userTokens = filteredTokens
  }
}
