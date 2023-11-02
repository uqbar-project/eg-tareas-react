import { render, screen } from '@testing-library/react'
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
      render(<BrowserRouter><TareasComponent /></BrowserRouter>)
      expect(await screen.findByTestId('tarea_159')).toBeInTheDocument()
      expect(await screen.findByTestId('tarea_68')).toBeInTheDocument()
    })
  })
})