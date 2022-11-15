export const mostrarMensajeError = (error, setearMensaje) => {
    const status = error.response.status
    const mensajeError = status >= 500 ? 'Ocurrió un error. Consulte al administrador del sistema' :
      error.response.data.message
    if (status >= 500) {
      console.error(error)
    }
    setearMensaje(mensajeError)
  }
