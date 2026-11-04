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
  async getTareas(paginationData: PaginationData): Promise<TareasPaginadas> {
    const url = PAGINATION_CONFIG.enabled
      ? `${REST_SERVER_URL}/tareas?page=${paginationData?.page || 1}&limit=${paginationData?.limit || 10}`
      : `${REST_SERVER_URL}/tareas`
    const { data: responseData } = await axios.get(url)
    const hasMore = PAGINATION_CONFIG.enabled ? responseData?.hasMore : false
    const tareasJson = PAGINATION_CONFIG.enabled
      ? responseData?.data
      : responseData
    if (!Array.isArray(tareasJson)) {
      throw new Error(
        'La búsqueda de tareas no trajo resultados, revise la configuración de la aplicación (por ejemplo el paginado)'
      )
    }
    const tareas = tareasJson.map(tareaAsJson)
    return { tareas, hasMore }
  }

  async getTareaById(id: number) {
    const tareaJson = await axios.get(`${REST_SERVER_URL}/tareas/${id}`)
    return tareaAsJson(tareaJson.data)
  }

  async actualizarTarea(tarea: Tarea): Promise<Tarea> {
    const { data: tareaJSON } = await axios.put<TareaJSON>(
      `${REST_SERVER_URL}/tareas/${tarea.id}`,
      tarea.toJSON()
    )
    return Tarea.fromJson(tareaJSON)
  }

  async crearTarea(tarea: Tarea): Promise<Tarea> {
    const { data: tareaJSON } = await axios.post<TareaJSON>(
      `${REST_SERVER_URL}/tareas`,
      tarea.toJSON()
    )
    return Tarea.fromJson(tareaJSON)
  }

  eliminarTarea(id: number) {
    return axios.delete(`${REST_SERVER_URL}/tareas/${id}`)
  }
}

export const tareaService = new TareaService()
