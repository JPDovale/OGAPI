import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  defaultProject: { type: String, required: true },
  literaryGenere: { type: String, required: true },
  isbn: { type: String },
  frontCover: { type: Object, default: {} },
  generes: { type: Array, required: true, default: [] },
  authors: { type: Array, required: true, default: [] },
  plot: { type: Object, required: true },
  words: { type: String },
  writtenWords: { type: String, default: '0' },
  capitules: { type: Array },
  comments: { type: Array, default: [] },
  createAt: { type: String, required: true },
  updateAt: { type: String, required: true },
})

export const BookMongo = mongoose.model('Book', BookSchema)
