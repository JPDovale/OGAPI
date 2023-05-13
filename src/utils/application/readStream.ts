import { type Readable } from 'stream'

export async function readStream(readable: Readable): Promise<Buffer> {
  const chunks: any[] = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}
