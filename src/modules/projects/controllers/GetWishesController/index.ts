import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetWishesUseCase } from '@modules/projects/useCases/GetWishesUseCase'

export class GetWishesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetWishesControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetWishesControllerParamsSchema.parse(req.params)

    const getWishesUseCase = container.resolve(GetWishesUseCase)
    const response = await getWishesUseCase.execute({
      userId: id,
      projectId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const wishesPartied = parserPersonsResponse.parserWishes(
      response.data?.wishes ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        wishes: wishesPartied,
      },
    }
    return res.status(responseStatusCode).json(responsePartied)
  }
}
