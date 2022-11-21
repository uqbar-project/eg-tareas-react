import { render, screen, waitFor, } from '@testing-library/react'
import axios from 'axios'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { Usuario } from '../../domain/usuario'
import { TareasRoutes } from '../../routes'
import { crearTarea } from '../../testsUtils/crearTarea'

describe('tests de asignar tarea', () => {
  const idTareaAsignada = 159
  let mockGetAxios

  beforeEach(() => {
    jest.mock('axios')
    mockGetAxios = jest.spyOn(axios, 'get')

    mockGetAxios.mockResolvedValueOnce((
      { 
        data: [
          new Usuario('Marcos Rojo'), 
          new Usuario('Delia Negro'), 
          new Usuario('Valeria Blanco')
        ]
      }
    ))

    mockGetAxios.mockResolvedValueOnce((
      { data: crearTarea(idTareaAsignada, 'Construir test TODO List', 0, 'Marcos Rojo') }
    ))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
 
  test('al inicio muestra la información de la tarea', async () => {
    render(
      <MemoryRouter initialEntries={[`/asignarTarea/${idTareaAsignada}`]} initialIndex={0}>
        <TareasRoutes/>
      </MemoryRouter>
    )

    // Verificamos que se llamó al backend correctamente
    expect(mockGetAxios).toHaveBeenCalledWith(`http://localhost:9000/tareas/${idTareaAsignada}`)

    await waitFor(() => {
      const descripcion = screen.getByTestId('descripcion').value
      expect(descripcion).toBe('Construir test TODO List')  
    })

    // lamentablemente no funciona el test del select de material, no refresca correctamente los usuarios
    // pese a intentarlo todo: within, envolverlo en un waitFor...
  })
  
})