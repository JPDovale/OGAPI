import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { PlotUpdateUseCase } from '@modules/projects/useCases/PlotUpdateUseCase'

export class PlotUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const plotUpdateParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const plotUpdateBodySchema = z.object({
      onePhrase: z.string().max(10000).optional().nullable(),
      premise: z.string().max(10000).optional().nullable(),
      storyteller: z.string().max(10000).optional().nullable(),
      literaryGenre: z.string().max(10000).optional().nullable(),
      subgenre: z.string().max(10000).optional().nullable(),
      ambient: z.string().max(10000).optional().nullable(),
      countTime: z.string().max(10000).optional().nullable(),
      historicalFact: z.string().max(10000).optional().nullable(),
      details: z.string().max(10000).optional().nullable(),
      summary: z.string().max(100000).optional().nullable(),
      urlOfText: z.string().max(400).optional().nullable(),
      structure: z
        .object({
          act1: z.string().max(10000).optional().nullable(),
          act2: z.string().max(10000).optional().nullable(),
          act3: z.string().max(10000).optional().nullable(),
        })
        .optional(),
    })

    const { id } = req.user
    const { projectId } = plotUpdateParamsSchema.parse(req.params)
    const plot = plotUpdateBodySchema.parse(req.body)

    const plotUpdateUseCase = container.resolve(PlotUpdateUseCase)
    const { project } = await plotUpdateUseCase.execute({
      plot,
      userId: id,
      projectId,
    })

    return res.status(200).json({ project })
  }
}
