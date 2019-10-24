import { REST_SERVER_URL } from './constants'

export class UsuarioService {

  allInstances() {
    return fetch(REST_SERVER_URL + '/usuarios')
  }

}