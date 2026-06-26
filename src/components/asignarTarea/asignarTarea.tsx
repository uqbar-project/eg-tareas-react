import { type ChangeEvent, useState } from 'react'

import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { useOnInit } from '@/customHooks/hooks'
import { useToast } from '@/customHooks/useToast'
import { Tarea } from '@/domain/tarea'
import type { Usuario } from '@/domain/usuario'
import type { PaginadorContextType } from '@/routes'
import { tareaService } from '@/services/tareaService'
import { usuarioService } from '@/services/usuarioService'
import { getMensajeError } from '@/utils/errorHandling'
import { Toast } from '../common/toast'
import './asignarTarea.css'

export const AsignarTareaComponent = () => {
  const { actualizarTarea } = useOutletContext<PaginadorContextType>()
  const { toast, showToast } = useToast()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [tarea, setTarea] = useState(new Tarea())
  const navigate = useNavigate()

  const { id } = useParams()

  useOnInit(async () => {
    try {
      const nuevosUsuarios = await usuarioService.allInstances()
      setUsuarios(nuevosUsuarios)
      if (!id) {
        return
      }
      const nuevaTarea = await tareaService.getTareaById(Number(id))
      setTarea(nuevaTarea)
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error)
      showToast(errorMessage, 'error')
    }
  })

  const asignar = (asignatario: string) => {
    if (asignatario === ' ') {
      tarea.desasignar()
      generarNuevaTarea(tarea)
      return
    }
    const asignatarioNuevo = usuarios.find(
      (usuario) => usuario.nombre === asignatario
    )
    if (!asignatarioNuevo) {
      return
    }
    tarea.asignarA(asignatarioNuevo)
    generarNuevaTarea(tarea)
  }

  const generarNuevaTarea = (tarea: Tarea) => {
    const nuevaTarea = Object.assign(new Tarea(), tarea)
    setTarea(nuevaTarea)
  }

  const cambiarDescripcion = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    tarea.descripcion = event?.target.value
    generarNuevaTarea(tarea)
  }

  const aceptarCambios = async () => {
    try {
      tarea.validarAsignacion()
      await tareaService.actualizarTarea(tarea)
      actualizarTarea(tarea)
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
      <div className="title">Asignar tarea</div>
      <div className="fieldLabel">Descripción</div>
      <div>
        <input
          type="text"
          data-testid="descripcion"
          id="descripcion"
          value={tarea.descripcion}
          onChange={cambiarDescripcion}
          className="formControl"
        />
      </div>
      <div className="fieldLabel">Asignatario</div>
      <div>
        <select
          /* Acá podemos ver cómo esta declarado nombreAsignatario */
          value={tarea.nombreAsignatario ?? ' '}
          onChange={(event) => asignar(event.target.value)}
          className="formControl"
          title="asignatario"
          name="asignatario"
          data-testid="asignatario"
        >
          <option value=" ">Sin Asignar</option>
          {usuarios.map((usuario) => (
            <option value={usuario.nombre} key={usuario.nombre}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </div>
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
          data-testid="aceptar"
          onClick={aceptarCambios}
        >
          Aceptar
        </button>
      </div>
      <div id="toast-container">
        <Toast toast={toast} />
      </div>
    </div>
  )
}
