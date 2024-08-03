import { describe, expect, test } from "vitest"
import { Tarea } from "./tarea"
import { Usuario } from "./usuario"

const persona = new Usuario('Alguien')

describe('tests de tarea', () => {
  test('una tarea inicialmente no está asignada', () => {
    expect(new Tarea().estaAsignada()).toBeFalsy()
  })

  test('una tarea que va a hacer una persona está asignada', () => {
    const tareaAsignada = new Tarea()
    tareaAsignada.asignarA(persona)
    expect(tareaAsignada.estaAsignada()).toBeTruthy()
  })

  test('contiene palabra por componente - caso feliz', () => {
    const tarea = new Tarea()
    tarea.descripcion = 'Testear el componente login'
    expect(tarea.contiene('componente')).toBeTruthy()
  })

  test('contiene palabra por asignatario - caso feliz', () => {
    const tarea = new Tarea()
    tarea.descripcion = 'Testear el componente login'
    tarea.asignarA(persona)
    expect(tarea.contiene('Algu')).toBeTruthy()
  })

  test('contiene palabra - caso no encontrado', () => {
    const tarea = new Tarea()
    tarea.descripcion = 'Testear el componente login'
    tarea.asignarA(persona)
    expect(tarea.contiene('Componente')).toBeFalsy()
  })

  test('una tarea que está a menos del 100% y asignada se puede cumplir', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 99
    tarea.asignarA(persona)
    expect(tarea.sePuedeCumplir()).toBeTruthy()
  })

  test('una tarea que está a menos del 100% y asignada se puede desasignar', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 99
    tarea.asignarA(persona)
    expect(tarea.sePuedeDesasignar()).toBeTruthy()
  })

  test('una tarea que está al 100% no se puede desasignar', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 100
    tarea.asignarA(persona)
    expect(tarea.sePuedeDesasignar()).toBeFalsy()
  })

  test('una tarea que está al 100% no se puede cumplir', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 100
    tarea.asignarA(persona)
    expect(tarea.sePuedeCumplir()).toBeFalsy()
  })

  test('una tarea que está al 100% pero no asignada no se puede cumplir', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 100
    expect(tarea.sePuedeCumplir()).toBeFalsy()
  })

  test('al cumplirse una tarea queda al 100%', () => {
    const tarea = new Tarea()
    tarea.asignarA(persona)
    tarea.cumplir()
    expect(tarea.porcentajeCumplimiento).toBe(100)
    expect(tarea.estaCumplida()).toBeTruthy()
    expect(tarea.cumplio(100)).toBeTruthy()
  })

  test('una tarea que está cumplida no puede asignarse', () => {
    const tarea = new Tarea()
    const newLocal = persona
    tarea.asignarA(newLocal)
    tarea.cumplir()
    expect(tarea.sePuedeAsignar()).toBeFalsy()
  })

  test('la tarea conoce el nombre del asignatario', () => {
    const tarea = new Tarea()
    tarea.asignarA(persona)
    expect(tarea.nombreAsignatario).toBe(persona.nombre)
  })

  test('conversión a JSON trae el nombre del asignatario', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 20
    tarea.iteracion = 'Sprint 3'
    tarea.asignarA(persona)
    const tareaJson = tarea.toJSON()
    expect(tareaJson.asignadoA).toBe(persona.nombre)
    expect(tareaJson.porcentajeCumplimiento).toBe(20)
    expect(tareaJson.iteracion).toBe('Sprint 3')
    expect(tareaJson.fecha).toBe('10/10/2015')
  })

  test('conversión desde JSON trae el nombre del asignatario', () => {
    const tarea = Tarea.fromJson({
      id: 1,
      descripcion: '',
      fecha: '10/07/2024',
      porcentajeCumplimiento: 20,
      asignadoA: persona.nombre,
      iteracion: 'Sprint 3'
    })
    expect(tarea.nombreAsignatario).toBe(persona.nombre)
    expect(tarea.porcentajeCumplimiento).toBe(20)
    expect(tarea.iteracion).toBe('Sprint 3')
  })
  test('una tarea sin asignatario no es válida', () => {
    const tarea = new Tarea()
    expect(() => { tarea.validarAsignacion() }).toThrowError()
  })

  test('una tarea con asignatario es válida', () => {
    const tarea = Tarea.fromJson({
      id: 1,
      descripcion: 'Validar asignatario',
      fecha: '04/05/2021',
      porcentajeCumplimiento: 20,
      asignadoA: persona.nombre,
      iteracion: 'Sprint 3',
    })
    expect(() => { tarea.validarAsignacion() }).not.toThrowError()
  })
})
