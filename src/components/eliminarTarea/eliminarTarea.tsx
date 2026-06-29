import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { useOnInit } from '@/customHooks/hooks'
import { useToast } from '@/customHooks/useToast'
import type { Tarea } from '@/domain/tarea'
import type { PaginadorContextType } from '@/routes'
import { tareaService } from '@/services/tareaService'
import { getMensajeError } from '@/utils/errorHandling'
import { Toast } from '../common/toast'
import './eliminarTarea.css'

export const EliminarTareaComponent = () => {
  const { eliminarTarea } = useOutletContext<PaginadorContextType>()
  const { toast, showToast } = useToast()
  const [tarea, setTarea] = useState<Tarea | null>(null)
  const navigate = useNavigate()

  const { id } = useParams()

  useOnInit(async () => {
    try {
      if (!id) {
        return
      }
      const tareaCargada = await tareaService.getTareaById(Number(id))
      setTarea(tareaCargada)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error)
      showToast(errorMessage, 'error')
    }
  })

  const eliminar = async () => {
    try {
      if (!tarea) {
        return
      }
      await tareaService.eliminarTarea(tarea.id)
      await eliminarTarea(tarea.id)
      volver()
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error)
      showToast(errorMessage, 'error')
    }
  }

  const volver = () => {
    navigate(-1)
  }

  return (
    <div className="container">
      <div className="title">Eliminar tarea</div>
      {tarea && (
        <div className="confirmMessage">
          ¿Está seguro que desea eliminar la tarea &quot;{tarea.descripcion}
          &quot;?
        </div>
      )}
      <div className="botonera">
        <button
          type="button"
          className="secondary"
          data-testid="cancelar"
          onClick={volver}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="primary"
          data-testid="eliminar"
          onClick={eliminar}
        >
          Eliminar
        </button>
      </div>
      <div id="toast-container">
        <Toast toast={toast} />
      </div>
    </div>
  )
}
