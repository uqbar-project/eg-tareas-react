import { Tarea } from '../domain/tarea'
import { REST_SERVER_URL } from './constants'

class TareaService {

  tareaAsJson(tareaJSON) {
    return Tarea.fromJson(tareaJSON)
  }

  async allInstances() {
    const respuesta = await fetch(`${REST_SERVER_URL}/tareas`)
    const tareasJson = await respuesta.json()
    return tareasJson.map((tareaJson) => Tarea.fromJson(tareaJson)) //this.tareaAsJson
  }

  async getTareaById(id) {
    const respuesta = await fetch(`${REST_SERVER_URL}/tareas/${id}`)
    const tareaJson = await respuesta.json()
    return this.tareaAsJson(tareaJson)
  }

  actualizarTarea(tarea) {
    return fetch(`${REST_SERVER_URL}/tareas/${tarea.id}`, {
      method: 'put',
      body: JSON.stringify(tarea.toJSON())
    })
  }

}

export const tareaService = new TareaService()
