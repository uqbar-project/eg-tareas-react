export type ValidationError = {
  field: string
  message: string
}

export const obtenerErrorPorCampo = (
  errores: ValidationError[],
  campo: string
): string | undefined => errores.find((error) => error.field === campo)?.message

import { isBefore, parse, startOfDay } from 'date-fns'
import { Usuario } from './usuario'

const PORCENTAJE_CUMPLIDA = 100

export class Tarea {
  id = 0

  constructor(
    public descripcion = '',
    public iteracion = '',
    public asignatario: Usuario | null = null,
    public fecha = new Date().toLocaleDateString('en-CA'),
    public porcentajeCumplimiento = 0
  ) {}

  contiene(palabra: string): boolean {
    return (
      this.descripcion.includes(palabra) ||
      (this.asignatario?.nombre?.includes(palabra) ?? false)
    )
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

  private static formatearFechaAInput(fecha: string): string {
    if (!fecha) {
      return fecha
    }
    const [dia, mes, anio] = fecha.split('/')
    return `${anio}-${mes}-${dia}`
  }

  private static formatearFechaABackend(fecha: string): string {
    if (!fecha) {
      return fecha
    }
    const [anio, mes, dia] = fecha.split('-')
    return `${dia}/${mes}/${anio}`
  }

  static fromJson(tareaJSON: TareaJSON): Tarea {
    const result = Object.assign(new Tarea(), tareaJSON, {
      asignatario: tareaJSON.asignadoA
        ? Usuario.fromJSON(tareaJSON.asignadoA)
        : null,
    })
    result.fecha = Tarea.formatearFechaAInput(result.fecha)
    delete result.asignadoA
    return result
  }

  get nombreAsignatario() {
    return this.asignatario?.nombre
  }

  get fechaFormateada() {
    return this.fecha.split('-').reverse().join('/')
  }

  toJSON(): TareaJSON {
    return {
      ...(this.id ? { id: this.id } : {}),
      descripcion: this.descripcion,
      iteracion: this.iteracion,
      porcentajeCumplimiento: this.porcentajeCumplimiento,
      fecha: Tarea.formatearFechaABackend(this.fecha),
      asignadoA: this.nombreAsignatario,
    }
  }

  validarCreacion(): ValidationError[] {
    const errores: ValidationError[] = []

    const descripcionValida = this.descripcion?.trim()
    if (!descripcionValida) {
      errores.push({
        field: 'descripcion',
        message: 'La descripción es obligatoria',
      })
    }

    const fechaIngresada = this.fecha
    if (!fechaIngresada) {
      errores.push({
        field: 'fecha',
        message: 'La fecha debe ser mayor o igual a la fecha de hoy',
      })
    } else {
      const hoy = startOfDay(new Date())
      const fechaTarea = startOfDay(
        parse(fechaIngresada, 'yyyy-MM-dd', new Date())
      )

      if (isBefore(fechaTarea, hoy)) {
        errores.push({
          field: 'fecha',
          message: 'La fecha debe ser mayor o igual a la fecha de hoy',
        })
      }
    }

    return errores
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
  id?: number
  descripcion: string
  iteracion: string
  porcentajeCumplimiento: number
  asignadoA?: string
  fecha: string
}
