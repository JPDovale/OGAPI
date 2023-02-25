import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'

import { IRefreshTokenMongo } from '../entities/RefreshToken'

export interface IFindByRefreshToken {
  refreshToken: string
}

export interface IRefreshTokenRepository {
  create: ({
    expiresDate,
    refreshToken,
    userId,
  }: ICreateUserTokenDTO) => Promise<IRefreshTokenMongo>

  findByUserIdAndRefreshToken: (
    userId: string,
    refreshToken: string,
  ) => Promise<IRefreshTokenMongo>

  deleteById: (refreshTokenId: string) => Promise<void>

  deletePerUserId: (userId: string) => Promise<void>

  findByUserId: (userId: string) => Promise<IRefreshTokenMongo[]>

  findByRefreshToken: ({
    refreshToken,
  }: IFindByRefreshToken) => Promise<IRefreshTokenMongo>
}
