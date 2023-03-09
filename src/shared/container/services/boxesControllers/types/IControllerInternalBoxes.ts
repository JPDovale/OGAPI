export interface IControllerInternalBoxes {
  name: string
  projectId: string
  userId: string
  projectName: string
  archive?: {
    id: string
    title: string
    description: string
  }
  error?: {
    title: string
    message: string
  }
  linkId: string
  withoutArchive?: boolean
}
