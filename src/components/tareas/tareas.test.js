import { render, wait } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { tareaService } from '../../services/tareaService'
import { crearTarea } from '../../testsUtils/crearTarea'
import { TareasComponent } from './tareas'

const mockTareas =
  [
    crearTarea(68, 'Desarrollar TODO List en React', 75, 'Paula Paretto'),
    crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
  ]

describe('TareasComponent', () => {
  describe('cuando el servicio responde correctamente', () => {
    test('se muestran las tareas en la tabla', async () => {
      tareaService.allInstances = () => Promise.resolve(mockTareas)
      const { getByTestId } = render(<BrowserRouter><TareasComponent /></BrowserRouter>)
      //
      // está deprecado para la versión 10 de React Testing Library
      // hay que usar [waitFor](https://testing-library.com/docs/dom-testing-library/api-async)
      await wait()
      //
      expect(getByTestId('tarea_159')).toBeInTheDocument()
      expect(getByTestId('tarea_68')).toBeInTheDocument()
    })
  })
})