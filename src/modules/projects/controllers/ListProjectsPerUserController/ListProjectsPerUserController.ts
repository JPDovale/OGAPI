import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { ParserProjectsPreviewResponse } from '@modules/projects/responses/parsers/ParserProjectsPreviewResponse'
import { ListProjectsPerUserUseCase } from '@modules/projects/useCases/ListProjectsPerUserUseCase/ListProjectsPerUserUseCase'

export class ListProjectsPerUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const listProjectsPerUserUseCase = container.resolve(
      ListProjectsPerUserUseCase,
    )
    const response = await listProjectsPerUserUseCase.execute({
      userId: id,
    })

    const parserProjectsPreviewResponse = container.resolve(
      ParserProjectsPreviewResponse,
    )
    const responsePartied = parserProjectsPreviewResponse.parser(response)

    if (response.error) {
      return res.status(response.error.statusCode).json(responsePartied)
    }

    return res.status(200).json(responsePartied)
  }
}
