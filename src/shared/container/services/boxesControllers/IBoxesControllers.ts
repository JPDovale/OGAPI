import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'

import { IControllerInternalBoxes } from './types/IControllerInternalBoxes'

export interface IBoxesControllers {
  controllerInternalBoxes: ({
    archive,
    name,
    projectId,
    projectName,
    userId,
    error,
  }: IControllerInternalBoxes) => Promise<IBox>
}
