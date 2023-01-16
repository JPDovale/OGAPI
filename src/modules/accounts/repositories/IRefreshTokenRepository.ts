import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO'
import { IRefreshTokenMongo } from '../infra/mongoose/entities/RefreshToken'

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
}
