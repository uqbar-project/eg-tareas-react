import { Usuario, USUARIO_NULO } from './usuario'

const PORCENTAJE_CUMPLIDA = 100
export class Tarea {
  constructor() {
    this.id = 0
    this.descripcion = ''
    this.iteracion = ''
    this.asignatario = USUARIO_NULO
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
    return this.porcentajeCumplimiento < PORCENTAJE_CUMPLIDA && this.estaAsignada()
  }

  cumplir() {
    this.porcentajeCumplimiento = PORCENTAJE_CUMPLIDA
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
    return this.porcentajeCumplimiento === PORCENTAJE_CUMPLIDA
  }

  estaAsignada() {
    return !this.asignatario.equals(USUARIO_NULO)
  }

  static fromJson(tareaJSON) {
    return Object.assign(new Tarea(),
      tareaJSON,
      { asignatario: Usuario.fromJSON(tareaJSON.asignadoA) })
  }

  get nombreAsignatario() {
    return this.asignatario.nombre
  }

  toJSON() {
    return {
      ...this,
      asignatario: null,
      asignadoA: this.asignatario.nombre,
    }
  }

  validarAsignacion() {
    if (!this.nombreAsignatario.trim()) {
      throw new UserException('Debe asignar la tarea a una persona')
    }
  }
}

class UserException extends Error {
  toString() {
    return this.message
  }
}