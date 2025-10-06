import { AxiosError } from 'axios'

// TODO: hacer tests

export const getMensajeError = (error: unknown) => {
  let errorMessage = 'Ocurrió un error. Consulte al administrador del sistema'
  if (error instanceof Error) {
    errorMessage = error.message
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? error.response
    errorMessage = !status ? 'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema' : error.response?.data.message
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