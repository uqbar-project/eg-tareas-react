import './tareas.css'

import { useState } from 'react'
import { useOnInit } from 'src/customHooks/hooks'
import { ErrorResponse, getMensajeError } from 'src/utils/error-handling'
import { tareaService } from 'src/services/tareaService'
import TareaRow from './tareaRow/tareaRow'
import { Tarea } from 'src/domain/tarea'
import { useToast } from 'src/customHooks/useToast'
import { Toast } from 'src/components/common/toast'

export const TareasComponent = () => {

  const [tareas, setTareas] = useState<Tarea[]>([])

  const { toast, showToast } = useToast()

  const traerTareas = async () => {
    try {
      const tareas = await tareaService.allInstances()
      setTareas(tareas)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      showToast(errorMessage, 'error')
    }
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
                actualizar={traerTareas} />)
          }
        </tbody>
      </table>
      <div id="toast-container">
        <Toast toast={toast} />
      </div>
    </div>
  )
}
