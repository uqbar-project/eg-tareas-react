import './tareas.css'

import { useState } from 'react'
import { useOnInit } from 'src/customHooks/hooks'
import { ErrorResponse, getMensajeError } from 'src/utils/errorHandling'
import { tareaService } from 'src/services/tareaService'
import TareaRow from './tareaRow/tareaRow'
import { Tarea } from 'src/domain/tarea'
import { useToast } from 'src/customHooks/useToast'
import { Toast } from 'src/components/common/toast'

const pageSize = 10

export const TareasComponent = () => {

  const [tareas, setTareas] = useState<Tarea[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const {toast, showToast} = useToast()

  const getTareas = async (newPage: number, init = false) => {
    try {
      const { tareas, hasMore} = await tareaService.getTareas({ page: newPage, limit: pageSize })
      setHasMore(hasMore)
      setTareas((oldTareas) => (init ? [] : oldTareas).concat(tareas))
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      showToast(errorMessage, 'error')
    }
  }

  const traerMasTareas = async () => {
    const newPage = page + 1
    getTareas(newPage)
    setPage(newPage)
  }

  const traerTareas = async () => {
    getTareas(page, true)
  }

  const actualizarTarea = async (tareaActualizada: Tarea) => {
    const nuevasTareas = [...tareas]
    const indexTarea = nuevasTareas.findIndex((tareaSearch: Tarea) => tareaSearch.id == tareaActualizada.id)
    nuevasTareas[indexTarea] = tareaActualizada
    setTareas(nuevasTareas)
  }

  useOnInit(traerTareas)

  return (
    <div className='container'>
      <br />
      <div className="title">Tareas a realizar</div>
      <table aria-label="simple table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th id="fecha">Fecha</th>
            <th id="asignatario">Asignatario</th>
            <th>%</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody data-testid="resultados">
          {
            tareas.map((tarea) =>
              <TareaRow
                tarea={tarea}
                key={tarea.id}
                actualizar={actualizarTarea} />)
          }
        </tbody>
      </table>
      {hasMore && <div>
        <button className='buttonRow secondary' onClick={traerMasTareas}>Ver más tareas</button>
      </div>}
      <div id="toast-container">
        <Toast toast={toast} />
      </div>
    </div>
  )
}
