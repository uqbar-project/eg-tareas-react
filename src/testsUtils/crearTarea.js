import { Tarea } from '../domain/tarea'
import { Usuario } from '../domain/usuario'

export function crearTarea(id, descripcion, porcentaje, asignado) {
    return Object.assign(new Tarea(), {
        id,
        descripcion,
        porcentaje,
        asignatario: new Usuario(asignado)
    })
}