import { type ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'

import { type IRefreshTokenMongo } from '../entities/RefreshToken'

export interface IFindByRefreshToken {
  refreshToken: string
}

export interface IRefreshTokenRepository {
  create: ({
    expiresDate,
    refreshToken,
    userId,
  }: ICreateUserTokenDTO) => Promise<IRefreshTokenMongo | null | undefined>

  findByUserIdAndRefreshToken: (
    userId: string,
    refreshToken: string,
  ) => Promise<IRefreshTokenMongo | null | undefined>

  deleteById: (refreshTokenId: string) => Promise<void>

  deletePerUserId: (userId: string) => Promise<void>

  findByUserId: (userId: string) => Promise<IRefreshTokenMongo[]>

  findByRefreshToken: ({
    refreshToken,
  }: IFindByRefreshToken) => Promise<IRefreshTokenMongo | null | undefined>
}
