import { shallow } from 'enzyme'
import React from 'react'
import { TareasComponent } from './tareas'
import { TareaService } from '../../services/tareaService'
import { crearTarea } from '../../testsUtils/crearTarea'



const mockTareas =
  [
    crearTarea(68, 'Desarrollar TODO List en React', 75, 'Paula Paretto'),
    crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
  ]

describe('TareasComponent', () => {
  describe('cuando el servicio respode correctamente', () => {
    it('se muestran las tareas en la tabla', async (done) => {
      TareaService.allInstances = () => Promise.resolve(mockTareas)
      const componente = shallow(<TareasComponent />)
      setTimeout(() => {
        expect(componente.find('#tarea_159')).toBeTruthy()
        expect(componente.find('#tarea_68')).toBeTruthy()
        done()
      }, 1000)

    })
  })
})