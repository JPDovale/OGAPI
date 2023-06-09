import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserProjectResponse } from '@modules/projects/responses/parsers/ParserProjectResponse'
import { ShareProjectUseCase } from '@modules/projects/useCases/ShareProjectUseCase'

export class ShareProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const shareProjectParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const shareProjectBodySchema = z.object({
      email: z.string().email().max(100),
      permission: z.enum(['edit', 'view', 'comment']),
    })

    const { id } = req.user
    const { projectId } = shareProjectParamsSchema.parse(req.params)
    const { email, permission } = shareProjectBodySchema.parse(req.body)

    const shareProjectUseCase = container.resolve(ShareProjectUseCase)
    const response = await shareProjectUseCase.execute({
      email,
      permission,
      projectId,
      userId: id,
    })

    const parserProjectResponse = container.resolve(ParserProjectResponse)
    const responsePartied = parserProjectResponse.parser(response)

    if (response.error) {
      return res.status(response.error.statusCode).json(responsePartied)
    }

    return res.status(200).json(responsePartied)
  }
}
