import { Usuario } from "./usuario"

const PORCENTAJE_CUMPLIDA = 100

export class Tarea {
  id = 0

  constructor(public descripcion = '', public iteracion = '', public asignatario: Usuario | null = null, public fecha = '10/10/2015', public porcentajeCumplimiento = 0) {
  }

  contiene(palabra: string) {
    return this.descripcion.includes(palabra) || this.asignatario?.nombre?.includes(palabra)
  }

  cumplio(porcentaje: number) {
    return this.porcentajeCumplimiento === porcentaje
  }

  cumplioMenosDe(porcentaje: number) {
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

  asignarA(asignatario: Usuario) {
    this.asignatario = asignatario
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

  static fromJson(tareaJSON: TareaJSON): Tarea {
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

  toJSON(): TareaJSON {
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

export type TareaJSON = {
  id: number
  descripcion: string
  iteracion: string
  porcentajeCumplimiento: number
  asignadoA?: string
  fecha: string
}