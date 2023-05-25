import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import {
  type IPaymentMode,
  type IPaymentStatus,
} from '@modules/products/infra/repositories/types/IPaymentStatus'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

import { type IUserResponse } from '../types/IUserResponse'

interface IResponse {
  user: IUser
}

interface IResponsePartied {
  user: IUserResponse
  [x: string]: any
}

type IParserUserResponse = IResolve<IResponse> | IResolve<IResponsePartied>

export function parseUserData(user: IUser): IUserResponse {
  const userResponse: IUserResponse = {
    account: {
      id: user.id,
      isSocialLogin: user.is_social_login,
      notification: {
        notifications: user.notifications ?? [],
        numberNew: user.new_notifications,
      },
      subscription: user.subscription
        ? {
            id: user.subscription.id,
            expiresAt: user.subscription.expires_at,
            status: user.subscription.payment_status as IPaymentStatus,
            mode: user.subscription.mode as IPaymentMode,
          }
        : null,
    },
    infos: {
      age: user.age,
      avatar: {
        alt: user.username,
        url: user.avatar_url ?? undefined,
      },
      createdAt: user.created_at,
      email: user.email,
      name: user.name,
      sex: user.sex,
      username: user.username,
    },
  }

  return userResponse
}

export function parserUserResponse(
  response: IResolve<IResponse>,
): IParserUserResponse {
  if (!response.ok || !response.data?.user) return response

  const userResponse: IResponsePartied = {
    user: parseUserData(response.data.user),
  }

  const responsePartied: IResolve<IResponsePartied> = {
    ok: response.ok,
    error: response.error,
    data: userResponse,
  }

  return responsePartied
}
