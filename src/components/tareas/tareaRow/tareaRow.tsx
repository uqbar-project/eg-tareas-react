import { useNavigate } from 'react-router-dom'

import { ErrorResponse, getMensajeError } from 'src/utils/error-handling'
import { tareaService } from 'src/services/tareaService'
import { PorcentajeCumplimiento } from 'src/components/porcentajeCumplimiento/porcentajeCumplimiento'
import { Tarea } from 'src/domain/tarea'
import { useToast } from 'src/customHooks/useToast'
import { Toast } from 'src/components/common/toast'

export const TareaRow = ({ tarea, actualizar }: { tarea: Tarea, actualizar: () => void }) => {
  const navigate = useNavigate()

  const { toast, showToast } = useToast()

  const cumplirTarea = async () => {
    // debugger // para mostrar que no se cambia la ui despues de hacer tarea.cumplir()
    try {
      tarea.cumplir()
      await tareaService.actualizarTarea(tarea)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error as ErrorResponse)
      showToast(errorMessage, 'error')
    } finally {
      // viene como props
      await actualizar()
    }
  }

  const goToAsignarTarea = () => {
    navigate(`/asignarTarea/${tarea.id}`)
  }

  const cumplirButton = tarea.sePuedeCumplir() &&
    <img className="icon" src="/finish.png" title="Cumplir tarea" data-testid={`cumplir_${tarea.id}`} aria-label="Cumplir" onClick={cumplirTarea} />

  const asignarButton = tarea.sePuedeAsignar() &&
    <img className="icon" src="/assign.png" title="Asignar tarea" data-testid={`asignar_${tarea.id}`} aria-label="Asignar" onClick={goToAsignarTarea} />

  return (<>
    <tr key={tarea.id} data-testid={'tarea_' + tarea.id}>
      <td>
        {tarea.descripcion}
      </td>
      <td id="fecha">{tarea.fecha}</td>
      <td id="asignatario">{tarea.nombreAsignatario}</td>
      <td>
        <PorcentajeCumplimiento porcentaje={tarea.porcentajeCumplimiento} />
      </td>
      <td>
        {cumplirButton}
        {asignarButton}
      </td>
    </tr>
    <div id="toast-container">
      <Toast toast={toast} />
    </div>
  </>
  )
}

export default TareaRow
