import { type Prisma } from '@prisma/client'

export interface IUpdateBookDTO {
  bookId: string
  data: Prisma.BookUpdateInput
}
