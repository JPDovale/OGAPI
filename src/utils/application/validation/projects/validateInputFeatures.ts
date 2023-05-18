import { z } from 'zod'

export const validadeInputFeatures = z.object({
  books: z.boolean(),
  citys: z.boolean(),
  familys: z.boolean(),
  institutions: z.boolean(),
  languages: z.boolean(),
  nations: z.boolean(),
  persons: z.boolean(),
  planets: z.boolean(),
  plot: z.boolean(),
  powers: z.boolean(),
  races: z.boolean(),
  religions: z.boolean(),
  timeLines: z.boolean(),
})
