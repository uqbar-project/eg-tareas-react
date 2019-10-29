import { REST_SERVER_URL } from './constants'

export class UsuarioService {

  async allInstances() {
    const response = await fetch(`${REST_SERVER_URL}/usuarios`)
    const usuariosJson = await response.json()
    return usuariosJson
  }

}