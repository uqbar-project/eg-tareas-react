import { useNavigate } from 'react-router-dom'

import { ErrorResponse, getMensajeError } from 'src/utils/errorHandling'
import { tareaService } from 'src/services/tareaService'
import { PorcentajeCumplimiento } from 'src/components/porcentajeCumplimiento/porcentajeCumplimiento'
import { Tarea } from 'src/domain/tarea'
import { useToast } from 'src/customHooks/useToast'

export const TareaRow = ({ tarea, actualizar }: { tarea: Tarea, actualizar: (tarea: Tarea) => void }) => {
  const navigate = useNavigate()

  const { showToast } = useToast()

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
      await actualizar(tarea)
    }
  }

  const goToAsignarTarea = () => {
    navigate(`/asignarTarea/${tarea.id}`)
  }

  const cumplirButton = tarea.sePuedeCumplir() &&
    <img height="36" width="36" className="icon" src="/finishOk.png" title="Cumplir tarea" data-testid={`cumplir_${tarea.id}`} aria-label="Cumplir" onClick={cumplirTarea} />

  const asignarButton = tarea.sePuedeAsignar() &&
    <img height="36" width="36" className="icon" src="/assignOk.png" title="Asignar tarea" data-testid={`asignar_${tarea.id}`} aria-label="Asignar" onClick={goToAsignarTarea} />

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
  </>
  )
}

export default TareaRow
