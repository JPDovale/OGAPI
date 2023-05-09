import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { GetBoxesUseCase } from '@modules/boxes/useCases/GetBoxesUseCase'

export class GetBoxesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const getBoxesUseCase = container.resolve(GetBoxesUseCase)
    const { boxes } = await getBoxesUseCase.execute({
      userId: id,
    })

    return res.status(200).json({ boxes })
  }
}
