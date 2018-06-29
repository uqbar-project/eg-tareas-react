import { Tarea } from "../domain/tarea"
import { REST_SERVER_URL } from "./constants"

export class TareaService {

  tareaAsJson(tareaJSON) {
    return Tarea.fromJson(tareaJSON)
  }

  allInstances() {
    return fetch(REST_SERVER_URL + "/tareas")
  }

  getTareaById(id) {
    return fetch(REST_SERVER_URL + "/tareas/" + id)
      .then((res) => res.json())
      .then(tareaJson => this.tareaAsJson(tareaJson))
  }

  actualizarTarea(tarea) {
    return fetch(REST_SERVER_URL + "/tareas/" + tarea.id, {
      method: 'put',
      body: JSON.stringify(tarea.toJSON())
    })
  }

}