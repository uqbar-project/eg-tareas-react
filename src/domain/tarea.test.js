import { Tarea } from "./tarea"

const nombrePersona = 'Alguien'

describe('tests de tarea', () => {
  test('una tarea inicialmente no está asignada', () => {
    expect(new Tarea().estaAsignada()).toBeFalsy()
  })

  test('una tarea que va a hacer una persona está asignada', () => {
    const tareaAsignada = new Tarea()
    tareaAsignada.asignarA(nombrePersona)
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
    tarea.asignarA(nombrePersona)
    expect(tarea.contiene('Algu')).toBeTruthy()
  })

  test('contiene palabra - caso no encontrado', () => {
    const tarea = new Tarea()
    tarea.descripcion = 'Testear el componente login'
    tarea.asignarA(nombrePersona)
    expect(tarea.contiene('Componente')).toBeFalsy()
  })

  test('una tarea que está a menos del 100% y asignada se puede cumplir', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 99
    tarea.asignarA(nombrePersona)
    expect(tarea.sePuedeCumplir()).toBeTruthy()
  })

  test('una tarea que está al 100% no se puede cumplir', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 100
    tarea.asignarA(nombrePersona)
    expect(tarea.sePuedeCumplir()).toBeFalsy()
  })

  test('una tarea que está al 100% pero no asignada no se puede cumplir', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 100
    expect(tarea.sePuedeCumplir()).toBeFalsy()
  })

  test('al cumplirse una tarea queda al 100%', () => {
    const tarea = new Tarea()
    tarea.asignarA(nombrePersona)
    tarea.cumplir()
    expect(tarea.porcentajeCumplimiento).toBe(100)
    expect(tarea.estaCumplida()).toBeTruthy()
  })

  test('una tarea que está cumplida no puede asignarse', () => {
    const tarea = new Tarea()
    const newLocal = nombrePersona
    tarea.asignarA(newLocal)
    tarea.cumplir()
    expect(tarea.sePuedeAsignar()).toBeFalsy()
  })

  test('la tarea conoce el nombre del asignatario', () => {
    const tarea = new Tarea()
    tarea.asignarA(nombrePersona)
    expect(tarea.nombreAsignatario).toBe(nombrePersona)
  })

  test('la tarea conoce el nombre del asignatario', () => {
    const tarea = new Tarea()
    tarea.asignarA(nombrePersona)
    expect(tarea.nombreAsignatario).toBe(nombrePersona)
  })

  test('conversión a JSON trae el nombre del asignatario', () => {
    const tarea = new Tarea()
    tarea.porcentajeCumplimiento = 20
    tarea.iteracion = 'Sprint 3'
    tarea.asignarA(nombrePersona)
    const tareaJson = tarea.toJSON()
    expect(tareaJson.asignadoA).toBe(nombrePersona)
    expect(tareaJson.porcentajeCumplimiento).toBe(20)
    expect(tareaJson.iteracion).toBe('Sprint 3')
    expect(tareaJson.fecha).toBe('10/10/2015')
    expect(tareaJson.asignatario).toBeNull()
  })

  test('conversión desde JSON trae el nombre del asignatario', () => {
    const tarea = Tarea.fromJson({
      porcentajeCumplimiento: 20,
      asignadoA: nombrePersona,
      iteracion: 'Sprint 3'
    })
    expect(tarea.nombreAsignatario).toBe(nombrePersona)
    expect(tarea.porcentajeCumplimiento).toBe(20)
    expect(tarea.iteracion).toBe('Sprint 3')
    expect(tarea.asignadoA).toBeUndefined()
  })
  test('una tarea sin asignatario no es válida', () => {
    expect(() => { tarea.validarAsignacion() }).toThrowError()
  })
})
