import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { UpdatePersonUseCase } from '@modules/persons/useCases/UpdatePersonUseCase'

export class UpdatePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatePersonParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const updatePersonBodySchema = z.object({
      name: z.string().max(60).optional(),
      lastName: z.string().max(60).optional(),
      history: z.string().max(10000).optional(),
      age: z.coerce.number().max(1000000).optional().nullable(),
      bornMonth: z.coerce.number().max(12).optional(),
      bornDay: z.coerce.number().max(31).optional(),
      bornHour: z.coerce.number().max(24).optional(),
      bornMinute: z.coerce.number().max(60).optional(),
      bornSecond: z.coerce.number().max(60).optional(),
    })

    const { id } = req.user
    const { personId } = updatePersonParamsSchema.parse(req.params)
    const {
      age,
      history,
      lastName,
      name,
      bornDay,
      bornHour,
      bornMinute,
      bornMonth,
      bornSecond,
    } = updatePersonBodySchema.parse(req.body)

    const updatePersonUseCase = container.resolve(UpdatePersonUseCase)
    const response = await updatePersonUseCase.execute({
      userId: id,
      personId,
      age,
      history,
      lastName,
      name,
      bornDay,
      bornHour,
      bornMinute,
      bornMonth: bornMonth ? bornMonth - 1 : undefined, // month is received like  1 -> 12 in name months respective, but when logical is Applied the months transformed to format 0 -> 11 in respective names
      bornSecond,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonResponse = container.resolve(ParserPersonResponse)
    const responsePartied = parserPersonResponse.parser(response)

    return res.status(responseStatusCode).json(responsePartied)
  }
}
