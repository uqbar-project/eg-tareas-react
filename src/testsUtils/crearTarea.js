import { Tarea } from 'src/domain/tarea'
import { Usuario } from 'src/domain/usuario'

export function crearTarea(id, descripcion, porcentajeCumplimiento, asignado) {
    return Object.assign(new Tarea(), {
        id,
        descripcion,
        porcentajeCumplimiento,
        asignatario: new Usuario(asignado)
    })
}