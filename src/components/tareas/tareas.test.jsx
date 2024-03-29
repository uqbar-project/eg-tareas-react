import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { TareasComponent } from './tareas'
import { crearTarea } from 'src/testsUtils/crearTarea'
import { tareaService } from 'src/services/tareaService'

const mockTareas =
  [
    crearTarea(68, 'Desarrollar TODO List en React', 75, 'Paula Paretto'),
    crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
  ]

describe('TareasComponent', () => {
  describe('cuando el servicio responde correctamente', () => {
    test('se muestran las tareas en la tabla', async () => {
      tareaService.allInstances = () => Promise.resolve(mockTareas)
      render(<BrowserRouter><TareasComponent /></BrowserRouter>)
      expect(await screen.findByTestId('tarea_159')).toBeInTheDocument()
      expect(await screen.findByTestId('tarea_68')).toBeInTheDocument()
    })
  })
})