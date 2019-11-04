import { REST_SERVER_URL } from './constants'

class UsuarioService {

  async allInstances() {
    const response = await fetch(`${REST_SERVER_URL}/usuarios`)
    const usuariosJson = await response.json()
    return usuariosJson
  }

}
export const usuarioService = new UsuarioService()
