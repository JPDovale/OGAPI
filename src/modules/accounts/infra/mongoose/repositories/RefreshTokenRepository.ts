import { v4 as uuidV4 } from 'uuid'

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'

import { IRefreshTokenMongo, RefreshTokenMongo } from '../entities/RefreshToken'

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    dataUserTokenObj: ICreateUserTokenDTO,
  ): Promise<IRefreshTokenMongo> {
    const { expiresDate, refreshToken, userId } = dataUserTokenObj

    const tokenInAppAlreadyExists = await RefreshTokenMongo.findOne({
      userId,
      application: 'OG-web',
    })

    if (tokenInAppAlreadyExists) {
      await RefreshTokenMongo.findOneAndDelete(tokenInAppAlreadyExists.id)
    }

    const userToken = new RefreshTokenMongo({
      id: uuidV4(),
      userId,
      expiresDate,
      refreshToken,
    })

    await userToken.save()

    return userToken
  }

  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<IRefreshTokenMongo> {
    const userToken = await RefreshTokenMongo.findOne({
      userId,
      refreshToken,
    })
    return userToken
  }

  async deleteById(id: string): Promise<void> {
    await RefreshTokenMongo.deleteOne({ id })
  }

  async deletePerUserId(userId: string): Promise<void> {
    await RefreshTokenMongo.deleteMany({ userId })
  }
}
