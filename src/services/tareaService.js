import axios from 'axios'

import { Tarea } from '../domain/tarea'
import { REST_SERVER_URL } from './constants'

class TareaService {

  tareaAsJson(tareaJSON) {
    return Tarea.fromJson(tareaJSON)
  }

  async allInstances() {
    const tareasJson = await axios.get(`${REST_SERVER_URL}/tareas`)
    return tareasJson.data.map((tareaJson) => Tarea.fromJson(tareaJson)) // o ... this.tareaAsJson
  }

  async getTareaById(id) {
    const tareaJson = await axios.get(`${REST_SERVER_URL}/tareas/${id}`)
    return this.tareaAsJson(tareaJson.data)
  }

  actualizarTarea(tarea) {
    return axios.put(`${REST_SERVER_URL}/tareas/${tarea.id}`, tarea.toJSON())
  }

}

export const tareaService = new TareaService()
