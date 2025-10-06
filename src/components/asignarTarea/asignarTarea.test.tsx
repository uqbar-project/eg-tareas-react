import { render, screen, waitFor, } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter } from 'react-router-dom'
import { TareasRoutes } from 'src/routes'
import { REST_SERVER_URL } from 'src/services/constants'
import { vi, expect, test, beforeEach, describe, afterEach, type MockInstance } from 'vitest'

describe('tests de asignar tarea', () => {
  const idTareaAsignada = 159
  let spyGetAxios: MockInstance<typeof axios['get']>

  beforeEach(() => {
    vi.mock('axios')
    spyGetAxios = vi.spyOn(axios, 'get')

    spyGetAxios
      .mockResolvedValueOnce({
        data: [ 
          {
            id: 1,
            nombre: 'Carlos Rojo',
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          id: idTareaAsignada,
          descripcion: 'Ejemplo',
          iteracion: '',
          asignadoA: 'Carlos Rojo',
          porcentajeCumplimiento: 0,
        }
      })
  })

  afterEach(() => {
     vi.clearAllMocks()
  })

  test('al inicio muestra la información de la tarea', async () => {
    render(
      <MemoryRouter initialEntries={[`/asignarTarea/${idTareaAsignada}`]} initialIndex={0}>
        <TareasRoutes/>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(spyGetAxios.mock.calls[0]).to.deep.equal([`${REST_SERVER_URL}/usuarios`])
      expect(spyGetAxios.mock.calls[1]).to.deep.equal([`${REST_SERVER_URL}/tareas/${idTareaAsignada}`])
    })

    await waitFor(() => {
      const textDescripcion = (screen.getByTestId('descripcion') as HTMLInputElement).value
      expect(textDescripcion).toBe('Ejemplo')
    })
    await waitFor(() => {
      const asignatario = (screen.getByTestId('asignatario') as HTMLSelectElement).value
      expect(asignatario).toBe('Carlos Rojo')
    })
  })

  test('al cambiar el asignatario se asigna a una nueva persona', () => {

  })
})