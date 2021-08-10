import { Usuario } from './usuario'

const PORCENTAJE_CUMPLIDA = 100
export class Tarea {
  constructor() {
    this.id = 0
    this.descripcion = ''
    this.iteracion = ''
    this.asignatario = null
    this.fecha = '10/10/2015'
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
    return this.cumplioMenosDe(PORCENTAJE_CUMPLIDA) && this.estaAsignada()
  }

  cumplir() {
    this.porcentajeCumplimiento = PORCENTAJE_CUMPLIDA
  }

  desasignar() {
    this.asignatario = null
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
    return this.porcentajeCumplimiento === PORCENTAJE_CUMPLIDA
  }

  estaAsignada() {
    return !!this.asignatario
  }

  static fromJson(tareaJSON) {
    const result = Object.assign(new Tarea(),
      tareaJSON,
      { asignatario: tareaJSON.asignadoA ? Usuario.fromJSON(tareaJSON.asignadoA) : null }
    )
    // eliminamos el dato de JSON
    delete result.asignadoA
    return result
  }

  get nombreAsignatario() {
    return this.asignatario?.nombre
  }

  toJSON() {
    return {
      ...this,
      asignatario: null, // o podríamos pisarlo
      asignadoA: this.nombreAsignatario,
    }
  }

  validarAsignacion() {
    if (!this.nombreAsignatario) {
      throw new UserException('Debe asignar la tarea a una persona')
    }
  }
}

class UserException extends Error {
  toString() {
    return this.message
  }
}