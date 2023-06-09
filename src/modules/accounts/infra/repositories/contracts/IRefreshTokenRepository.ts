import { type ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'

import { type IRefreshToken } from '../entities/IRefreshToken'

export interface IFindByRefreshToken {
  refreshToken: string
}

export abstract class IRefreshTokenRepository {
  abstract create(
    refreshToken: ICreateUserTokenDTO,
  ): Promise<IRefreshToken | null>

  abstract findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<IRefreshToken | null>

  abstract deleteById(refreshTokenId: string): Promise<void>

  abstract deletePerUserId(userId: string): Promise<void>

  abstract deletePerUserAndApplication(
    userId: string,
    application: string,
  ): Promise<void>

  abstract findByUserId(userId: string): Promise<IRefreshToken[]>

  abstract findByRefreshToken(
    query: IFindByRefreshToken,
  ): Promise<IRefreshToken | null>
}
