import axios from 'axios'

import { PaginationData, REST_SERVER_URL } from './constants'
import { Tarea, TareaJSON } from 'src/domain/tarea'

const tareaAsJson = (tareaJSON: TareaJSON) => Tarea.fromJson(tareaJSON)

export interface TareasPaginadas {
  hasMore: boolean
  tareas: Tarea[]
}
class TareaService {

  async getTareas(paginationData: PaginationData): Promise<TareasPaginadas> {
    const tareasJson = await axios.get(`${REST_SERVER_URL}/tareas?page=${paginationData?.page || 1}&limit=${paginationData?.limit || 10}`)
    const tareasResult = tareasJson.data
    const tareas = tareasResult.data.map((tareaJson: TareaJSON) => Tarea.fromJson(tareaJson)) // o ... this.tareaAsJson
    return { tareas: tareas.sort((a: Tarea, b: Tarea) => a.descripcion < b.descripcion ? -1 : 1), hasMore: tareasResult.hasMore }
  }

  async getTareaById(id: number) {
    const tareaJson = await axios.get(`${REST_SERVER_URL}/tareas/${id}`)
    return tareaAsJson(tareaJson.data)
  }

  actualizarTarea(tarea: Tarea) {
    return axios.put(`${REST_SERVER_URL}/tareas/${tarea.id}`, tarea.toJSON())
  }

}

export const tareaService = new TareaService()
