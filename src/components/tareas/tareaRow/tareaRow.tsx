import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icono } from '@/components/common/Icono'
import { PorcentajeCumplimiento } from '@/components/porcentajeCumplimiento/porcentajeCumplimiento'
import { useToast } from '@/customHooks/useToast'
import type { Tarea } from '@/domain/tarea'
import { tareaService } from '@/services/tareaService'
import { type ErrorResponse, getMensajeError } from '@/utils/errorHandling'

const SIN_ASIGNAR = '?'
const TONOS_AVATAR = 10

const HUES_AVATAR = [25, 50, 75, 100, 120, 235, 260, 285, 310, 335]

const TONOS = Array.from({ length: TONOS_AVATAR }, (_, indice) => indice + 1)

const AVANLANZE = [
  (valor: number) => valor ^ (valor >>> 16),
  (valor: number) => Math.imul(valor, 0x85ebca6b),
  (valor: number) => valor ^ (valor >>> 13),
  (valor: number) => Math.imul(valor, 0xc2b2ae35),
  (valor: number) => valor ^ (valor >>> 16),
]

const inicialesDe = (nombre?: string) => {
  const palabras = nombre?.trim().split(/\s+/).filter(Boolean) ?? []
  if (palabras.length === 0) {
    return SIN_ASIGNAR
  }
  if (palabras.length === 1) {
    return palabras[0].slice(0, 2).toUpperCase()
  }
  const primera = palabras[0].charAt(0).toUpperCase()
  const ultima = palabras[palabras.length - 1].charAt(0).toUpperCase()
  return primera + ultima
}

const hashDe = (nombre: string) =>
  AVANLANZE.reduce(
    (valor, paso) => paso(valor),
    [...nombre]
      .map((caracter) => caracter.charCodeAt(0))
      .reduce((hash, codigo) => (Math.imul(hash, 31) + codigo) | 0, 0) >>> 0
  )

const tonoPorNombre = new Map<string, number>()
const usosPorTono = new Map(TONOS.map((tono) => [tono, 0]))

const claveDe = (nombre: string, tono: number) =>
  (usosPorTono.get(tono) ?? 0) * 0x100000000 +
  ((hashDe(nombre) ^ Math.imul(tono, 0x9e3779b1)) >>> 0)

const registrar = (nombre: string) => {
  const tono = TONOS.reduce((mejor, candidato) =>
    claveDe(nombre, candidato) < claveDe(nombre, mejor) ? candidato : mejor
  )
  tonoPorNombre.set(nombre, tono)
  usosPorTono.set(tono, (usosPorTono.get(tono) ?? 0) + 1)
  return tono
}

const tonoDe = (nombre: string) =>
  tonoPorNombre.get(nombre) ?? registrar(nombre)

const tonoDeCss = (nombre: string) =>
  ({ '--tono': HUES_AVATAR[tonoDe(nombre) - 1] }) as CSSProperties

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
      title="Cumplir tarea"
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
      title="Asignar tarea"
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
      title="Eliminar tarea"
      className="icon-button"
    >
      <Icono nombre="eliminar" className="icon" />
    </button>
  )

  const nombreAsignatario = tarea.nombreAsignatario
  const sinAsignar = !nombreAsignatario
  const claseAvatar = sinAsignar ? 'avatar avatarSinAsignar' : 'avatar'

  return (
    <tr data-testid={`tarea_${tarea.id}`}>
      <td className="colTarea">
        <div className="tareaItem">
          <span
            className={claseAvatar}
            style={sinAsignar ? undefined : tonoDeCss(nombreAsignatario)}
            data-testid={`avatar_${tarea.id}`}
            aria-hidden="true"
          >
            {inicialesDe(nombreAsignatario)}
          </span>
          <span className="srOnly" data-testid={`asignatario_${tarea.id}`}>
            {nombreAsignatario ?? 'Sin asignar'}
          </span>
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
