import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-enzyme'
import React from 'react'
import App from './App'
import { TareaRow, TareasComponent } from './components/tareas'
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
  return Object.assign(new Tarea(), {
    id,
    descripcion,
    porcentaje,
    asignatario: new Usuario(asignado)
  })
}

const construirTest = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')

const mockTareas =
  [
    crearTarea(68, 'Desarrollar TODO List en React', 75, 'Paula Paretto'),
    construirTest
  ]

// Hack para que no falle el mount del TareasComponent
// https://github.com/airbnb/enzyme/issues/1626
if (global.document) {
  document.createRange = () => ({
    setStart: () => { },
    setEnd: () => { },
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
  expect(tareaConstruirTest.find('#cumplir_159')).toBeTruthy()
})
it('una tarea sin asignar no puede cumplirse', () => {
  const construirTest_sinAsignar = construirTest
  construirTest_sinAsignar.desasignar()
  const tareaConstruirTest = shallow(<TareaRow tarea={construirTest_sinAsignar} />)
  expect(tareaConstruirTest.find('#cumplir_159').exists()).toBeFalsy()
})
