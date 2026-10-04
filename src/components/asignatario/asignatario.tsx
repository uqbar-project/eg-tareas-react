import { inicialesDe, tonoDeCss } from './tonoAvatar'
import './asignatario.css'

const SIN_ASIGNAR = 'Sin asignar'

export const Asignatario = ({
  nombre,
  id,
}: {
  nombre?: string
  id: number
}) => {
  const sinAsignar = !nombre
  const visible = nombre ?? SIN_ASIGNAR

  return (
    <>
      <span
        className={sinAsignar ? 'avatar avatarSinAsignar' : 'avatar'}
        style={sinAsignar ? undefined : tonoDeCss(nombre)}
        data-testid={`avatar_${id}`}
        title={visible}
        aria-hidden="true"
      >
        {inicialesDe(nombre)}
      </span>
      <span className="srOnly" data-testid={`asignatario_${id}`}>
        {visible}
      </span>
    </>
  )
}
