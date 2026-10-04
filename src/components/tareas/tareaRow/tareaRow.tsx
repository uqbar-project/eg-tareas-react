import { useNavigate } from 'react-router-dom'
import { Asignatario } from '@/components/asignatario/asignatario'
import { Icono } from '@/components/common/Icono'
import { PorcentajeCumplimiento } from '@/components/porcentajeCumplimiento/porcentajeCumplimiento'
import { useToast } from '@/customHooks/useToast'
import type { Tarea } from '@/domain/tarea'
import { tareaService } from '@/services/tareaService'
import { type ErrorResponse, getMensajeError } from '@/utils/errorHandling'

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

  const goToEliminarTarea = () => {
    navigate(`/eliminarTarea/${tarea.id}`)
  }

  const cumplirButton = tarea.sePuedeCumplir() && (
    <button
      type="button"
      onClick={cumplirTarea}
      data-testid={`cumplir_${tarea.id}`}
      aria-label={`Cumplir tarea: ${tarea.descripcion}`}
      title="Cumplir"
      className="icon-button"
    >
      <Icono nombre="cumplir" className="icon" />
    </button>
  )

  const asignarButton = tarea.sePuedeAsignar() && (
    <button
      type="button"
      onClick={goToAsignarTarea}
      data-testid={`asignar_${tarea.id}`}
      aria-label={`Asignar tarea: ${tarea.descripcion}`}
      title="Asignar"
      className="icon-button"
    >
      <Icono nombre="asignar" className="icon" />
    </button>
  )

  const deleteButton = (
    <button
      type="button"
      onClick={goToEliminarTarea}
      data-testid={`eliminar_${tarea.id}`}
      aria-label={`Eliminar tarea: ${tarea.descripcion}`}
      title="Eliminar"
      className="icon-button"
    >
      <Icono nombre="eliminar" className="icon" />
    </button>
  )

  const nombreAsignatario = tarea.nombreAsignatario

  return (
    <tr data-testid={`tarea_${tarea.id}`}>
      <td className="colTarea">
        <div className="tareaItem">
          <Asignatario nombre={nombreAsignatario} id={tarea.id} />
          <div className="tareaDetalle">
            <span
              className="tareaDescripcion"
              data-testid={`title_${tarea.id}`}
            >
              {tarea.descripcion}
            </span>
            <span className="tareaMeta">
              <span data-testid={`fecha_${tarea.id}`}>
                {tarea.fechaFormateada}
              </span>
              {tarea.iteracion && (
                <>
                  <span aria-hidden="true">·</span>
                  <span data-testid={`iteracion_${tarea.id}`}>
                    {tarea.iteracion}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </td>
      <td
        data-testid={`porcentaje_${tarea.id}`}
        aria-label={`Porcentaje de cumplimiento: ${tarea.porcentajeCumplimiento}%`}
      >
        <PorcentajeCumplimiento porcentaje={tarea.porcentajeCumplimiento} />
      </td>
      <td className="colAcciones" aria-label="Acciones disponibles">
        {cumplirButton}
        {asignarButton}
        {deleteButton}
      </td>
    </tr>
  )
}
export default TareaRow
