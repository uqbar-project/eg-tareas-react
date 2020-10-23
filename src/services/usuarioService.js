import axios from 'axios'

import { REST_SERVER_URL } from './constants'

class UsuarioService {

  async allInstances() {
    const { data } = await axios.get(`${REST_SERVER_URL}/usuarios`)
    return data
  }

}
export const usuarioService = new UsuarioService()
