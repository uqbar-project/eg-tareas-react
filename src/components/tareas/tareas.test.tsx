import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { TareasComponent } from './tareas'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import axios from 'axios'

const mockTareas =
  [
    {
      id: 68, 
      descripcion: 'Desarrollar TODO List en React', 
      porcentajeCumplimiento: 75, 
      asignadoA: 'Paula Paretto'
    },
    {
      id: 159, 
      descripcion: 'Construir test TODO List', 
      porcentajeCumplimiento: 0, 
      asignadoA: 'Eliana Mendia'
    }
  ]

describe('TareasComponent', () => {

  beforeEach(() => {
    vi.mock('axios')
    const spyGetAxios = vi.spyOn(axios, 'get')

    spyGetAxios.mockResolvedValueOnce({
      data: mockTareas
    })
  })

  describe('cuando el servicio responde correctamente', () => {
    test('se muestran las tareas en la tabla', async () => {
      render(<BrowserRouter><TareasComponent /></BrowserRouter>)
      await waitFor(() => {
        expect(screen.getByTestId('tarea_159')).toBeTruthy()
        expect(screen.getByTestId('tarea_68')).toBeTruthy()
      })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})