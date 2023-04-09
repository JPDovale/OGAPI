import { AppError } from '../AppError'

export function makeErrorUserDoesPermissionToProject(
  permissionTo: 'comentar' | 'editar' | 'visualizar',
): AppError {
  return new AppError({
    title: 'Acesso negado pelo criador do projeto',
    message: `Parece que você não tem permissão para ${permissionTo} o projeto`,
    statusCode: 401,
  })
}
