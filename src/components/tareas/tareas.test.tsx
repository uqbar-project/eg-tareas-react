import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'
import { TareasRoutes } from 'src/routes'
import { tareaService } from 'src/services/tareaService'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('axios')

describe('TareasComponent', () => {
  const mockTareas = {
    hasMore: false,
    data: [
      {
        id: 68,
        descripcion: 'Desarrollar TODO List en React',
        porcentajeCumplimiento: 75,
        asignadoA: 'Paula Paretto',
      },
      {
        id: 159,
        descripcion: 'Construir test TODO List',
        porcentajeCumplimiento: 0,
        asignadoA: 'Eliana Mendia',
      },
    ],
  }

  beforeEach(() => {
    const spyGetAxios = vi.spyOn(axios, 'get')

    spyGetAxios.mockResolvedValueOnce({
      data: mockTareas.data,
    })
  })

  describe('cuando el servicio responde correctamente', () => {
    test('se muestran las tareas en la tabla', async () => {
      render(
        <BrowserRouter>
          <TareasRoutes />
        </BrowserRouter>
      )
      await waitFor(() => {
        expect(screen.getByTestId('tarea_159')).toBeTruthy()
        expect(screen.getByTestId('tarea_68')).toBeTruthy()
      })
    })

    test('si no hay más tareas no aparece el botón correspondiente', async () => {
      render(
        <BrowserRouter>
          <TareasRoutes />
        </BrowserRouter>
      )
      await waitFor(() => {
        expect(screen.getAllByRole('row')).not.toHaveLength(0)
      })
      expect(screen.queryByTestId('mas_tareas')).toBeNull()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})

describe('cuando el servicio responde correctamente y dice que tiene más tareas', () => {
  const mockResultTareas = {
    hasMore: true,
    data: [
      {
        id: 68,
        descripcion: 'Desarrollar TODO List en React',
        porcentajeCumplimiento: 75,
        asignadoA: 'Paula Paretto',
      },
    ],
  }
  const mockResultTareas2 = {
    hasMore: false,
    data: [
      {
        id: 91,
        descripcion: 'Resolver tests e2e',
        porcentajeCumplimiento: 80,
        asignadoA: 'Jeremías Ocaño',
      },
    ],
  }

  beforeEach(() => {
    tareaService.configurePagination(true)
    const spyGetAxios = vi.spyOn(axios, 'get')

    spyGetAxios.mockResolvedValueOnce({
      data: {
        hasMore: mockResultTareas.hasMore,
        data: mockResultTareas.data,
      },
    })
    spyGetAxios.mockResolvedValueOnce({
      data: {
        hasMore: mockResultTareas2.hasMore,
        data: mockResultTareas2.data,
      },
    })
  })

  test('al traer más tareas se visualizan las de la página actual y la anterior', async () => {
    render(
      <BrowserRouter>
        <TareasRoutes />
      </BrowserRouter>
    )
    await screen.findByTestId('tarea_68')
    await waitFor(() => {
      screen.getByTestId('mas_tareas').click()
    })
    await screen.findByTestId('tarea_91')
    expect(screen.getByTestId('tarea_68')).toBeTruthy()
    expect(screen.getByTestId('tarea_91')).toBeTruthy()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    tareaService.configurePagination(false)
  })
})
