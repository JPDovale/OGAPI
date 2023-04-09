import { type IUpdateBookDTO } from '@modules/books/dtos/IUpdateBookDTO'

export interface IUpdateBook {
  updatedInfos: IUpdateBookDTO
  id: string
}
