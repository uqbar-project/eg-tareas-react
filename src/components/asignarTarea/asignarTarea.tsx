import { ChangeEvent, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { Tarea } from 'src/domain/tarea'
import { getMensajeError } from 'src/utils/errorHandling'
import { tareaService } from 'src/services/tareaService'
import { usuarioService } from 'src/services/usuarioService'
import { useOnInit } from 'src/customHooks/hooks'
import { Usuario } from 'src/domain/usuario'

import './asignarTarea.css'
import { Toast } from '../common/toast'
import { useToast } from 'src/customHooks/useToast'

export const AsignarTareaComponent = () => {
  const { toast, showToast } = useToast()

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [tarea, setTarea] = useState(new Tarea())
  const navigate = useNavigate()

  const { id } = useParams()

  useOnInit(async () => {
    const nuevosUsuarios = await usuarioService.allInstances()
    setUsuarios(nuevosUsuarios)
    const nuevaTarea = await tareaService.getTareaById(+id!)
    setTarea(nuevaTarea)
  })

  const asignar = (asignatario: string) => {
    const asignatarioNuevo = usuarios.find((usuario) => usuario.nombre === asignatario)
    tarea.asignarA(asignatarioNuevo!)
    generarNuevaTarea(tarea)
  }

  const generarNuevaTarea = (tarea: Tarea) => {
    const nuevaTarea = Object.assign(new Tarea(), tarea)
    setTarea(nuevaTarea)
  }

  const cambiarDescripcion = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    tarea.descripcion = event?.target.value
    generarNuevaTarea(tarea)
  }

  const aceptarCambios = async () => {
    try {
      tarea.validarAsignacion()
      await tareaService.actualizarTarea(tarea)
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
      <div className="title">
        Asignar tarea
      </div>
      <div className='fieldLabel'>
        Descripción
      </div>
      <div>
        <input type="text" data-testid="descripcion" id="descripcion" value={tarea.descripcion} onChange={cambiarDescripcion} className="formControl" />
      </div>
      <div className='fieldLabel'>
        Asignatario
      </div>
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
          <option value=" ">
            Sin Asignar
          </option>
          {usuarios.map(usuario => <option value={usuario.nombre} key={usuario.nombre}>{usuario.nombre}</option>)}
        </select>
      </div>
      <div className="botonera">
        <button className="secondary" data-testid="cancelar" onClick={volver}>
          Cancelar
        </button>
        <button className="primary" data-testid="aceptar" onClick={aceptarCambios}>
          Aceptar
        </button>
      </div>
      <div id="toast-container">
        <Toast toast={toast} />
      </div>
    </div>
  )
}
