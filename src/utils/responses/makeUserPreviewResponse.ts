import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { type IUserPreview } from '@modules/accounts/responses/IUserPreview'

export function makeUserPreviewResponse(user: IUser): IUserPreview {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    notifications: user.notifications ?? [],
    new_notifications: user.new_notifications,
    subscription: user.subscription,
  }
}
