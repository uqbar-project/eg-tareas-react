import axios from 'axios'
import { Tarea, type TareaJSON } from '@/domain/tarea'
import {
  PAGINATION_CONFIG,
  type PaginationData,
  REST_SERVER_URL,
} from './constants'

const tareaAsJson = (tareaJSON: TareaJSON) => Tarea.fromJson(tareaJSON)

export interface TareasPaginadas {
  hasMore: boolean
  tareas: Tarea[]
}

class TareaService {
  private async getInternalTareas(paginationData: PaginationData) {
    if (PAGINATION_CONFIG.enabled) {
      const tareasJson = await axios.get(
        `${REST_SERVER_URL}/tareas?page=${paginationData?.page || 1}&limit=${paginationData?.limit || 10}`
      )
      const tareasResult = tareasJson.data
      return tareasResult
    } else {
      return {
        hasMore: false,
        data: (await axios.get(`${REST_SERVER_URL}/tareas`)).data,
      }
    }
  }
  async getTareas(paginationData: PaginationData): Promise<TareasPaginadas> {
    const tareasResult = await this.getInternalTareas(paginationData)
    const tareas = tareasResult.data.map((tareaJson: TareaJSON) =>
      Tarea.fromJson(tareaJson)
    ) // o ... this.tareaAsJson
    return { tareas, hasMore: tareasResult.hasMore }
  }

  async getTareaById(id: number) {
    const tareaJson = await axios.get(`${REST_SERVER_URL}/tareas/${id}`)
    return tareaAsJson(tareaJson.data)
  }

  actualizarTarea(tarea: Tarea) {
    return axios.put(`${REST_SERVER_URL}/tareas/${tarea.id}`, tarea.toJSON())
  }

  crearTarea(tarea: Tarea) {
    return axios.post(`${REST_SERVER_URL}/tareas`, tarea.toJSON())
  }

  eliminarTarea(id: number) {
    return axios.delete(`${REST_SERVER_URL}/tareas/${id}`)
  }
}

export const tareaService = new TareaService()
