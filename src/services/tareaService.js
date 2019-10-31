import { Tarea } from '../domain/tarea'
import { REST_SERVER_URL } from './constants'

export class TareaService {

  static tareaAsJson(tareaJSON) {
    return Tarea.fromJson(tareaJSON)
  }

  static async allInstances() {
    const respuesta = await fetch(`${REST_SERVER_URL}/tareas`)
    const tareasJson = await respuesta.json()
    return tareasJson.map((tareaJson) => Tarea.fromJson(tareaJson)) //this.tareaAsJson
  }

  static async getTareaById(id) {
    const respuesta = await fetch(`${REST_SERVER_URL}/tareas/${id}`)
    const tareaJson = await respuesta.json()
    return TareaService.tareaAsJson(tareaJson)
  }

  static actualizarTarea(tarea) {
    return fetch(`${REST_SERVER_URL}/tareas/${tarea.id}`, {
      method: 'put',
      body: JSON.stringify(tarea.toJSON())
    })
  }

}