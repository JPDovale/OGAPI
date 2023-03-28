import { type IArchive } from '@modules/boxes/infra/mongoose/entities/types/IArchive'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'

export interface ILinkObjectResponse {
  box: IBox
  archive: IArchive
}
