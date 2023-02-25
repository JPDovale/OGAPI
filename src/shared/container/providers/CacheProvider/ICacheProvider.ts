export interface ICacheProvider {
  setInfo: (key: string, value: any) => Promise<void>
  getInfo: (key: string) => Promise<any>
  refresh: () => Promise<void>
  delete: (key: string) => Promise<void>
}
