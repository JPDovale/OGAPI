import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'

import { type IControllerInternalBoxes } from './types/IControllerInternalBoxes'
import { type ILinkObject } from './types/ILinkObject'
import { type ILinkObjectResponse } from './types/ILinkObjectResponse'
import { type IUnlinkObject } from './types/IUnlinkObject'

export interface IBoxesControllers {
  controllerInternalBoxes: ({
    archive,
    name,
    projectId,
    projectName,
    userId,
    error,
  }: IControllerInternalBoxes) => Promise<IBox>

  unlinkObject: ({
    boxName,
    objectToUnlinkId,
    projectId,
    archiveId,
    withoutArchive,
  }: IUnlinkObject) => Promise<IBox>

  linkObject: ({
    boxName,
    projectId,
    archiveId,
    objectToLinkId,
    withoutArchive,
  }: ILinkObject) => Promise<ILinkObjectResponse>
}
