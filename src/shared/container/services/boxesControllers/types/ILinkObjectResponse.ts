import { IArchive } from '@modules/boxes/infra/mongoose/entities/types/IArchive'
import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'

export interface ILinkObjectResponse {
  box: IBox
  archive: IArchive
}
