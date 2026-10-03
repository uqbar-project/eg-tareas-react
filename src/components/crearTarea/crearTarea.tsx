import { type ChangeEvent, useId, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useOnInit } from '@/customHooks/hooks'
import { showToast } from '@/customHooks/useToast'
import { Tarea, type TareaJSON } from '@/domain/tarea'
import type { Usuario } from '@/domain/usuario'
import type { PaginadorContextType } from '@/routes'
import { tareaService } from '@/services/tareaService'
import { usuarioService } from '@/services/usuarioService'
import { getMensajeError } from '@/utils/errorHandling'
import './crearTarea.css'

export const CrearTareaComponent = () => {
  const { agregarTarea } = useOutletContext<PaginadorContextType>()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [tarea, setTarea] = useState(new Tarea())
  const navigate = useNavigate()

  const descripcionId = useId()
  const iteracionId = useId()
  const fechaId = useId()
  const asignatarioId = useId()

  useOnInit(async () => {
    try {
      const nuevosUsuarios = await usuarioService.allInstances()
      setUsuarios(nuevosUsuarios)
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

  const cambiarIteracion = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    tarea.iteracion = event?.target.value
    generarNuevaTarea(tarea)
  }

  const cambiarFecha = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    tarea.fecha = event?.target.value
    generarNuevaTarea(tarea)
  }

  const crear = async () => {
    try {
      const response = await tareaService.crearTarea(tarea)
      const tareaCreada = Tarea.fromJson(response.data as TareaJSON)
      await agregarTarea(tareaCreada)
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
      <div className="title">Crear tarea</div>
      <label className="fieldLabel" htmlFor={descripcionId}>
        Descripción
      </label>
      <div>
        <input
          type="text"
          data-testid="descripcion"
          id={descripcionId}
          value={tarea.descripcion}
          onChange={cambiarDescripcion}
          className="formControl"
        />
      </div>
      <label className="fieldLabel" htmlFor={iteracionId}>
        Iteración
      </label>
      <div>
        <input
          type="text"
          data-testid="iteracion"
          id={iteracionId}
          value={tarea.iteracion}
          onChange={cambiarIteracion}
          className="formControl"
        />
      </div>
      <label className="fieldLabel" htmlFor={fechaId}>
        Fecha
      </label>
      <div>
        <input
          type="date"
          data-testid="fecha"
          id={fechaId}
          value={tarea.fecha}
          onChange={cambiarFecha}
          className="formControl"
        />
      </div>
      <label className="fieldLabel" htmlFor={asignatarioId}>
        Asignatario
      </label>
      <div>
        <select
          id={asignatarioId}
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
          data-testid="crear"
          onClick={crear}
        >
          Crear
        </button>
      </div>
    </div>
  )
}
