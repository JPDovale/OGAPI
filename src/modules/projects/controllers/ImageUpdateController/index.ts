import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserProjectResponse } from '@modules/projects/responses/parsers/ParserProjectResponse'
import { ImageUpdateUseCase } from '@modules/projects/useCases/ImageUpdateUseCase'

export class ImageUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const imageUpdateParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = imageUpdateParamsSchema.parse(req.params)
    const { file } = req

    const imageUpdateUseCase = container.resolve(ImageUpdateUseCase)
    const response = await imageUpdateUseCase.execute({
      userId: id,
      projectId,
      file,
    })

    const parserProjectResponse = container.resolve(ParserProjectResponse)
    const responsePartied = parserProjectResponse.parser(response)

    if (response.error) {
      return res.status(response.error.statusCode).json(responsePartied)
    }

    return res.status(200).json(responsePartied)
  }
}
