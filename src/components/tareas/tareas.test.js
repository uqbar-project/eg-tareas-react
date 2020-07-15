import { mount } from 'enzyme'
import React from 'react'
import { TareasComponent } from './tareas'
import { tareaService } from '../../services/tareaService'
import { crearTarea } from '../../testsUtils/crearTarea'
import { act } from 'react-dom/test-utils'



const mockTareas =
  [
    crearTarea(68, 'Desarrollar TODO List en React', 75, 'Paula Paretto'),
    crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
  ]

  jest.mock('./tareaRow/tareaRow', () => {
    return function () {
      return <></>
    }
  })

describe('TareasComponent', () => {
  describe('cuando el servicio respode correctamente', () => {
    it('se muestran las tareas en la tabla', async () => {
      let componente
      tareaService.allInstances = () => Promise.resolve(mockTareas)
      await act(async () => {
        componente = await mount(<TareasComponent />)
      })
      componente.update()
      setImmediate(() => {
        expect(componente.find('[data-testid="tarea_159"]').exists()).toBeTruthy()
        expect(componente.find('[data-testid="tarea_68"]').exists()).toBeTruthy()
      })
    })
  })
})