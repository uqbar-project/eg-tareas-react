import './tareas.css'

import React, { useState } from 'react'
import { useOnInit } from 'src/customHooks/hooks'
import { ErrorResponse, getMensajeError } from 'src/utils/errorHandling'
import { tareaService } from 'src/services/tareaService'
import { Tarea } from 'src/domain/tarea'
import { useToast } from 'src/customHooks/useToast'
import { Toast } from 'src/components/common/toast'

const TareaRow = React.lazy(() => import('./tareaRow/tareaRow'))

const pageSize = 10

export const TareasComponent = () => {

  const [tareas, setTareas] = useState<Tarea[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const {toast, showToast} = useToast()

  const getTareas = async (newPage: number, init = false) => {
    try {
      const { tareas, hasMore } = await tareaService.getTareas({ page: newPage, limit: pageSize })
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
            <th className="center">%</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <React.Suspense fallback={
          <tbody>
            <tr>
              <td colSpan={5} data-testid='fallback_tareas'>Cargando filas...</td>
            </tr>
          </tbody>
          }>
          <tbody data-testid="resultados">
            {
              tareas.map((tarea) =>
                <TareaRow
                  tarea={tarea}
                  key={tarea.id}
                  actualizar={actualizarTarea} />)
            }
          </tbody>
        </React.Suspense>
      </table>
      {hasMore && <div>
        <button className='buttonRow secondary' data-testid="mas_tareas" onClick={traerMasTareas}>Ver más tareas</button>
      </div>}
      <div id="toast-container">
        <Toast toast={toast} />
      </div>
    </div>
  )
}
