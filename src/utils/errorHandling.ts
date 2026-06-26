import { AxiosError } from 'axios'

export const getMensajeError = (error: unknown) => {
  console.error(error)
  let errorMessage = 'Ocurrió un error. Consulte al administrador del sistema'
  if (error instanceof Error) {
    errorMessage = error.message
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? error.status ?? 0
    const backendMessage = (
      error.response?.data as { message?: string } | null | undefined
    )?.message

    errorMessage =
      status >= 400 && status < 500
        ? (backendMessage ?? errorMessage)
        : 'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema'
  }
  return errorMessage
}

export type ErrorResponse = {
  response: {
    status: number
    data: {
      message: string
    }
  }
}
