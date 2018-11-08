import { Usuario, USUARIO_NULO } from "./usuario"

export class Tarea {
    constructor() {
        this.id = 0
        this.descripcion = ""
        this.iteracion = ""
        this.asignatario = USUARIO_NULO
        this.fecha = new Date()
        this.porcentajeCumplimiento = 0
    }

    contiene(palabra) {
        return this.descripcion.includes(palabra) || this.asignatario.nombre.includes(palabra)
    }

    cumplio(porcentaje) {
        return this.porcentajeCumplimiento === porcentaje
    }

    cumplioMenosDe(porcentaje) {
        return this.porcentajeCumplimiento < porcentaje
    }

    sePuedeCumplir() {
        return this.porcentajeCumplimiento < 100 && this.estaAsignada()
    }

    cumplir() {
        this.porcentajeCumplimiento = 100
    }

    desasignar() {
        this.asignatario = USUARIO_NULO
    }

    sePuedeDesasignar() {
        return this.sePuedeCumplir()
    }

    asignarA(asignatario) {
        this.asignatario = new Usuario(asignatario)
    }

    sePuedeAsignar() {
        return !this.estaCumplida()
    }

    estaCumplida() {
        return this.porcentajeCumplimiento === 100
    }

    estaAsignada() {
        return !this.asignatario.equals(USUARIO_NULO)
    }

    static fromJson(tareaJSON) {
        const result = new Tarea()
        for (let key in tareaJSON) {
            result[key] = tareaJSON[key]
        }
        result.asignatario = Usuario.fromJSON(tareaJSON.asignadoA)
        return result
    }

    nombreAsignatario() {
        return this.asignatario.nombre
    }

    toJSON() {
        const result = Object.assign({}, this)
        result.asignatario = null 
        result.asignadoA = this.asignatario.nombre
        return result
    }

    validarAsignacion() {
        if (this.nombreAsignatario().trim() === "") {
            throw new UserException("Debe asignar la tarea a una persona")
        }
    }
}

class UserException extends Error {
    toString() {
        return this.message
    }
}