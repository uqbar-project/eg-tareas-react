import { render, screen, waitFor, } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter } from 'react-router-dom'

import { Usuario } from '../../domain/usuario'
import { TareasRoutes } from '../../routes'
import { REST_SERVER_URL } from '../../services/constants'
import { crearTarea } from '../../testsUtils/crearTarea'
import { vi, expect, test, beforeEach } from 'vitest'

describe('tests de asignar tarea', () => {
  const idTareaAsignada = 159
  let spyGetAxios

  beforeEach(() => {
    vi.mock('axios')
    spyGetAxios = vi.spyOn(axios, 'get')

    spyGetAxios.mockResolvedValueOnce(({
      data: [ new Usuario('Carlos Rojo') ]
    }))

    spyGetAxios.mockResolvedValueOnce(({
      data: crearTarea(idTareaAsignada, 'Ejemplo', 0, 'Carlos Rojo')
    }))
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

    expect(spyGetAxios).toHaveBeenCalledWith(`${REST_SERVER_URL}/tareas/${idTareaAsignada}`)

    await waitFor(() => {
      const textDescripcion = screen.getByTestId('descripcion').value
      expect(textDescripcion).toBe('Ejemplo')
    })

    // lamentablemente no funciona el test del select de material, no refresca correctamente los usuarios
    // pese a intentarlo todo: within, envolverlo en un waitFor...
  })
})