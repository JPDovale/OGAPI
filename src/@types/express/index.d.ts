/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  export interface Request {
    user: {
      id: string
      admin: boolean
      onApplication?: string | string[]
    }
  }
}
