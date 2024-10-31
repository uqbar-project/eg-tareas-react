import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { TareasComponent } from './tareas'
import { crearTarea } from 'src/testsUtils/crearTarea'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { tareaService } from 'src/services/tareaService'

const mockTareas =
  [
    crearTarea(68, 'Desarrollar TODO List en React', 75, 'Paula Paretto'),
    crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
  ]

describe('TareasComponent', () => {

  beforeEach(() => {
    vi.spyOn(tareaService, 'allInstances').mockResolvedValue(Promise.resolve(mockTareas))
  })

  describe('cuando el servicio responde correctamente', () => {
    test('se muestran las tareas en la tabla', async () => {
      render(<BrowserRouter><TareasComponent /></BrowserRouter>)
      expect(await screen.findByTestId('tarea_159')).toBeTruthy()
      expect(await screen.findByTestId('tarea_68')).toBeTruthy()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})