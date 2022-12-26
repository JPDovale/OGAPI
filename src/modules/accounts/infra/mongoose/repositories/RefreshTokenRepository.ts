import { v4 as uuidV4 } from 'uuid'

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'
import { IRefreshTokenRepository } from '@modules/accounts/repositories/IRefreshTokenRepository'
import { AppError } from '@shared/errors/AppError'

import { IRefreshTokenMongo, RefreshTokenMongo } from '../entities/RefreshToken'

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    dataUserTokenObj: ICreateUserTokenDTO,
  ): Promise<IRefreshTokenMongo> {
    const { expiresDate, refreshToken, userId } = dataUserTokenObj

    if (!userId || !refreshToken || !expiresDate) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

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
    if (!userId || !refreshToken) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      const userToken = await RefreshTokenMongo.findOne({
        userId,
        refreshToken,
      })
      return userToken
    } catch (err) {
      throw new AppError('Internal error', 500)
    }
  }

  async deleteById(id: string): Promise<void> {
    if (!id) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      await RefreshTokenMongo.deleteOne({ id })
    } catch (err) {
      throw new AppError('Internal error', 500)
    }
  }
}
