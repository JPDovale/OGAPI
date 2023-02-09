import mongoose from 'mongoose'

import { IAuthorBook } from '../types/IAuthorBook'
import { ICapitule } from '../types/ICapitule'
import { IGenereBook } from '../types/IGenereBook'

const BookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  defaultProject: { type: String, required: true },
  literaryGenere: { type: String, required: true },
  isbn: { type: String },
  frontCover: { type: Object, default: {} },
  generes: { type: Array<IGenereBook>, required: true, default: [] },
  authors: { type: Array<IAuthorBook>, required: true, default: [] },
  plot: { type: Object, required: true },
  words: { type: String, default: '0' },
  writtenWords: { type: String, default: '0' },
  capitules: { type: Array<ICapitule> },
  comments: { type: Array, default: [] },
  createAt: { type: String, required: true },
  updateAt: { type: String, required: true },
})

export const BookMongo = mongoose.model('Book', BookSchema)
