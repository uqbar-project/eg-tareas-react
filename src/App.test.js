import React from 'react'
import 'jest-enzyme'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { mount, shallow } from 'enzyme'

import App from './App'
import tareas, { TareasComponent, TareaRow } from './components/tareas'
import { Tarea } from './domain/tarea'
import { Usuario } from './domain/usuario'

configure({ adapter: new Adapter() })

const mockResponse = (status, statusText, response) => {
  return new window.Response(JSON.stringify(response), {
    status: status,
    statusText: statusText,
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    }
  })
}

function crearTarea(id, descripcion, porcentaje, asignado) {
  const result = new Tarea()
  result.id = id
  result.descripcion = descripcion
  result.porcentaje = porcentaje
  result.asignatario = new Usuario(asignado)
  return result
}

const construirTest = crearTarea(159, "Construir test TODO List", 0, "Marcos Rojo")

const mockTareas = 
  [
    crearTarea(68, "Desarrollar TODO List en React", 75, "Paula Paretto"),
    construirTest
  ]

// Hack para que no falle el mount del TareasComponent
// https://github.com/airbnb/enzyme/issues/1626
if (global.document) {
  document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
          nodeName: 'BODY',
          ownerDocument: document,
      },
  })
}
// fin hack

// Mock del fetch para devolver las tareas creadas en este test
const mockPromise = Promise.resolve(mockResponse(200, null, mockTareas))
window.fetch = jest.fn().mockImplementation(() => mockPromise)

it('app levanta ok', () => {
  shallow(<App />)
})
it('lista de tareas', () => {
  mount(<TareasComponent />)
})
it('una tarea asignada puede cumplirse', () => {
  const tareaConstruirTest = shallow(<TareaRow tarea={construirTest} />)
  expect(tareaConstruirTest.find("#cumplir_159")).toBeTruthy()
})
it('una tarea sin asignar no puede cumplirse', () => {
  const construirTest_sinAsignar = construirTest
  construirTest_sinAsignar.desasignar()
  const tareaConstruirTest = shallow(<TareaRow tarea={construirTest_sinAsignar} />)
  expect(tareaConstruirTest.find("#cumplir_159").exists()).toBeFalsy()
})