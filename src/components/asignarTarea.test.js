import { fireEvent, render, waitFor, within } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Usuario } from '../domain/usuario'
import { tareaService } from '../services/tareaService'
import { usuarioService } from '../services/usuarioService'
import { crearTarea } from '../testsUtils/crearTarea'
import AsignarTareaComponent from './asignarTarea'

describe('tests de asignar tarea', () => {
  let history
  let match

  beforeEach(() => {
    // eslint-disable-next-line no-unused-vars
    tareaService.getTareaById = (id) => Promise.resolve(
      crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
    )
    usuarioService.allInstances = () => Promise.resolve([
      new Usuario('Marcos Rojo'), 
      new Usuario('Delia Negro'), 
      new Usuario('Valeria Blanco')
    ])
    history = createMemoryHistory()
    history.push('/asignarTarea/159')
    match = {
      params: { id: 159 },
    }
  })
 
  test('al inicio muestra la información de la tarea', async () => {
    const { getByTestId, getByText } = render(<BrowserRouter><AsignarTareaComponent match={match} history={history}/></BrowserRouter>)
    await waitFor(() => {
      expect(getByTestId("descripcion").value).toBe("Construir test TODO List")
      // Material hace muy complicado poder encontrar el selector por data-testid
      expect(getByText("Marcos Rojo")).toBeInTheDocument()
    })
  })

  test('al reasignar cambia el asignatario de la tarea', async () => {
    const { getByText, getByRole } = render(<BrowserRouter><AsignarTareaComponent match={match} history={history}/></BrowserRouter>)
    await waitFor(() => {
      // Opción "recomendada" es en realidad super frágil
      // simulamos presionar el botón para expandir las opciones
      // y seleccionar otra pesrsona
      const selectButton = getByText(/Marcos Rojo/i)
      fireEvent.mouseDown(selectButton)
      const reasignacion = within(getByRole('listbox'))
      fireEvent.click(reasignacion.getByText(/Delia Negro/i))
      // Material hace muy complicado poder encontrar el selector por data-testid
      expect(reasignacion.getByText("Delia Negro")).toBeInTheDocument()
    })
  })
})