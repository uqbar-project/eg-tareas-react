const MENSAJE_ERROR = 'Ocurrió un error. Consulte al administrador del sistema'

const MENSAJE_ERROR_BACKEND =
  'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema'

type AxiosLikeError = {
  isAxiosError: true
  message: string
  status?: number
  response?: {
    status: number
    data: unknown
  }
}

const isAxiosLikeError = (error: unknown): error is AxiosLikeError =>
  typeof error === 'object' &&
  error !== null &&
  'isAxiosError' in error &&
  error.isAxiosError === true

const obtenerMensajeBackend = (data: unknown): string | undefined => {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('message' in data) ||
    typeof data.message !== 'string' ||
    !data.message.trim()
  ) {
    return undefined
  }

  return data.message.trim()
}

export const getMensajeError = (error: unknown): string => {
  if (isAxiosLikeError(error)) {
    const status = error.response?.status ?? error.status

    if (status !== undefined && status >= 400 && status < 500) {
      return obtenerMensajeBackend(error.response?.data) ?? error.message
    }

    console.error(error)
    return MENSAJE_ERROR_BACKEND
  }

  if (error instanceof Error) {
    console.error(error)
    return error.message || MENSAJE_ERROR
  }

  return MENSAJE_ERROR
}
