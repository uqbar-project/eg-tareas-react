import { useNavigate } from 'react-router-dom'
import { PorcentajeCumplimiento } from 'src/components/porcentajeCumplimiento/porcentajeCumplimiento'
import { useToast } from 'src/customHooks/useToast'
import type { Tarea } from 'src/domain/tarea'
import { tareaService } from 'src/services/tareaService'
import { type ErrorResponse, getMensajeError } from 'src/utils/errorHandling'

export const TareaRow = ({
  tarea,
  actualizar,
}: {
  tarea: Tarea
  actualizar: (tarea: Tarea) => void
}) => {
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

  const cumplirButton = tarea.sePuedeCumplir() && (
    <button
      type="button"
      onClick={cumplirTarea}
      data-testid={`cumplir_${tarea.id}`}
      aria-label={`Cumplir tarea: ${tarea.descripcion}`}
      title="Cumplir tarea"
      className="icon-button"
    >
      <img height="36" width="36" className="icon" src="/finishOk.png" alt="" />
    </button>
  )

  const asignarButton = tarea.sePuedeAsignar() && (
    <button
      type="button"
      onClick={goToAsignarTarea}
      data-testid={`asignar_${tarea.id}`}
      aria-label={`Asignar tarea: ${tarea.descripcion}`}
      title="Asignar tarea"
      className="icon-button"
    >
      <img height="36" width="36" className="icon" src="/assignOk.png" alt="" />
    </button>
  )

  return (
    <tr key={tarea.id} data-testid={`tarea_${tarea.id}`}>
      <td>{tarea.descripcion}</td>
      <td>{tarea.fecha}</td>
      <td>{tarea.nombreAsignatario}</td>
      <td
        aria-label={`Porcentaje de cumplimiento: ${tarea.porcentajeCumplimiento}%`}
      >
        <PorcentajeCumplimiento porcentaje={tarea.porcentajeCumplimiento} />
      </td>
      <td aria-label="Acciones disponibles">
        {cumplirButton}
        {asignarButton}
      </td>
    </tr>
  )
}

export default TareaRow
