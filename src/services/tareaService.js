import axios from 'axios'

import { REST_SERVER_URL } from './constants'
import { Tarea } from 'src/domain/tarea'

const tareaAsJson = (tareaJSON) => Tarea.fromJson(tareaJSON)

class TareaService {

  async allInstances() {
    const tareasJson = await axios.get(`${REST_SERVER_URL}/tareas`)
    const tareas = tareasJson.data.map((tareaJson) => Tarea.fromJson(tareaJson)) // o ... this.tareaAsJson
    return tareas.sort((a, b) => a.descripcion < b.descripcion ? -1 : 1)
  }

  async getTareaById(id) {
    const tareaJson = await axios.get(`${REST_SERVER_URL}/tareas/${id}`)
    return tareaAsJson(tareaJson.data)
  }

  actualizarTarea(tarea) {
    return axios.put(`${REST_SERVER_URL}/tareas/${tarea.id}`, tarea.toJSON())
  }

}

export const tareaService = new TareaService()
