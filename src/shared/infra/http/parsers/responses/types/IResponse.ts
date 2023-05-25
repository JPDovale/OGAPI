export interface IResolveError {
  title: string
  message: string
  statusCode: number
}

export interface IResolveRedirect {
  title: 'Login failed'
  message: 'Login failed'
  statusCode: 401
}

export interface IResolve<TypeData = undefined> {
  ok: boolean
  data?: TypeData
  error?: IResolveError | IResolveRedirect
}
