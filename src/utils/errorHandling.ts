import { AxiosError } from 'axios'

// TODO: hacer tests

export const getMensajeError = (error: unknown) => {
  let errorMessage = 'Ocurrió un error. Consulte al administrador del sistema'
  if (error instanceof Error) {
    errorMessage = error.message
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? error.status ?? 0
    errorMessage = status >= 400 && status < 500 ? error.response?.data.message : 'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema'
    console.error(error)
  }
  return errorMessage
}

export type ErrorResponse = {
  response: {
    status: number,
    data: {
      message: string
    }
  }
}