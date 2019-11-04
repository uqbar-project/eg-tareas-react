import { shallow } from 'enzyme'
import React from 'react'
import { TareasComponent } from './tareas'
import { tareaService } from '../../services/tareaService'
import { crearTarea } from '../../testsUtils/crearTarea'



const mockTareas =
  [
    crearTarea(68, 'Desarrollar TODO List en React', 75, 'Paula Paretto'),
    crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
  ]

describe('TareasComponent', () => {
  describe('cuando el servicio respode correctamente', () => {
    it('se muestran las tareas en la tabla', () => {
      tareaService.allInstances = () => Promise.resolve(mockTareas)
      const componente = shallow(<TareasComponent />)
      setImmediate(() => {
        expect(componente.find('[data-testid="tarea_159"]').exists()).toBeTruthy()
        expect(componente.find('[data-testid="tarea_68"]').exists()).toBeTruthy()
      })
    })
  })
})