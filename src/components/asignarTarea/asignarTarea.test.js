import { usuarioService } from './../../services/usuarioService';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import React from 'react'
import { BrowserRouter, createMemoryRouter } from 'react-router-dom'
import { Usuario } from '../../domain/usuario'
import { crearTarea } from '../../testsUtils/crearTarea'
import { tareaService } from '../../services/tareaService'
import { AsignarTareaComponent } from './asignarTarea'

describe('tests de asignar tarea', () => {
  let router
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
    router = createMemoryRouter([
      {
        path: '/asignarTarea/159',
      }
    ])
  })
 
  test('al inicio muestra la información de la tarea', async () => {
    render(<BrowserRouter router={router}><AsignarTareaComponent match={match}/></BrowserRouter>)
    await waitFor(() => {
      expect(screen.getByTestId('descripcion').value).toBe('Construir test TODO List')
      // Material hace muy complicado poder encontrar el selector por data-testid
    })
    await waitFor(() => {
      expect(screen.getByText('Marcos Rojo')).toBeInTheDocument()
    })
  })
  

  test('al reasignar cambia el asignatario de la tarea', async () => {
    render(<BrowserRouter router={router}><AsignarTareaComponent match={match}/></BrowserRouter>)
    // Opción 'recomendada' es en realidad super frágil
    // simulamos presionar el botón para expandir las opciones
    // y seleccionar otra pesrsona
    const selectButton = await screen.findByText(/Marcos Rojo/i)

    fireEvent.mouseDown(selectButton)
    const reasignacion = within(await screen.findByRole('listbox'))

    const delia = await screen.findByText(/Delia Negro/i)
    fireEvent.click(delia)

    // Material hace muy complicado poder encontrar el selector por data-testid
    expect(await reasignacion.findByText('Delia Negro')).toBeInTheDocument()
  })

  // Estaría bárbaro agregar más cobertura pero:
  // 1- Al intentar simular el click en asignar entramos en loop infinito de renders
  //    (hay que averiguar por qué)
  // 2- El costo de agregar cobertura supera al beneficio del código testeado y a lo
  //    poco resiliente que es (es muy fácil romper los tests)
})