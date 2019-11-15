import { REST_SERVER_URL } from './constants'
import axios from 'axios'

class UsuarioService {

  async allInstances() {
    const response = await axios.get(`${REST_SERVER_URL}/usuarios`)
    return response.data
  }

}
export const usuarioService = new UsuarioService()
