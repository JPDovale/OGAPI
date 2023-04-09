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
      onePhrase: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      premise: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      storyteller: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      literaryGenre: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      subgenre: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      ambient: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      countTime: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      historicalFact: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      details: z
        .string()
        .max(10000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      summary: z
        .string()
        .max(100000)
        // .regex(/^[^<>{}\\]+$/)
        .optional(),
      persons: z.array(z.string().min(6).max(100)).optional(),
      urlOfText: z.string().max(400).optional(),
      structure: z
        .object({
          act1: z
            .string()
            .max(10000)
            // .regex(/^[^<>{}\\]+$/)
            .optional(),
          act2: z
            .string()
            .max(10000)
            // .regex(/^[^<>{}\\]+$/)
            .optional(),
          act3: z
            .string()
            .max(10000)
            // .regex(/^[^<>{}\\]+$/)
            .optional(),
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
