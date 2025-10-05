import { render, screen, waitFor, } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter } from 'react-router-dom'
import { Usuario } from 'src/domain/usuario'
import { TareasRoutes } from 'src/routes'
import { REST_SERVER_URL } from 'src/services/constants'
import { crearTarea } from 'src/testsUtils/crearTarea'
import { vi, expect, test, beforeEach, describe, afterEach, type MockInstance } from 'vitest'

describe('tests de asignar tarea', () => {
  const idTareaAsignada = 159
  let spyGetAxios: MockInstance<typeof axios['get']>

  beforeEach(() => {
    vi.mock('axios')
    spyGetAxios = vi.spyOn(axios, 'get')

    spyGetAxios
      .mockResolvedValueOnce({
        data: [ new Usuario('Carlos Rojo') ]
      })
      .mockResolvedValueOnce({
        data: crearTarea(idTareaAsignada, 'Ejemplo', 0, 'Carlos Rojo')
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

    // lamentablemente no funciona el test del select de material, no refresca correctamente los usuarios
    // pese a intentarlo todo: within, envolverlo en un waitFor...
  })
})