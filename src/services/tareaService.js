import { Tarea } from '../domain/tarea'
import { REST_SERVER_URL } from './constants'
import axios from 'axios'

class TareaService {

  tareaAsJson(tareaJSON) {
    return Tarea.fromJson(tareaJSON)
  }

  async allInstances() {
    const tareasJson = await axios.get(`${REST_SERVER_URL}/tareas`)
    return tareasJson.data.map(this.tareaAsJson)
  }

  async getTareaById(id) {
    const respuesta = await axios.get(`${REST_SERVER_URL}/tareas/${id}`)
    return this.tareaAsJson(respuesta.data)
  }

  actualizarTarea(tarea) {
    return axios.put(`${REST_SERVER_URL}/tareas/${tarea.id}`,tarea)
  }

}

export const tareaService = new TareaService()
