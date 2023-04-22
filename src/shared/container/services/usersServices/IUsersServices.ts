import { type IUserEssentialInfos } from '@modules/accounts/infra/repositories/entities/IUserEssentialInfos'

export abstract class IUsersServices {
  abstract getEssentialInfos(userId: string): Promise<IUserEssentialInfos>
}
