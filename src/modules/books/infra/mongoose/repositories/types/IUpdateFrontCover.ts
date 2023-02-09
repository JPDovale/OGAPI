import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'

export interface IUpdateFrontCover {
  frontCover: IAvatar
  id: string
}
