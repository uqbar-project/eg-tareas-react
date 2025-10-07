import { render, screen, waitFor, } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { TareasRoutes } from 'src/routes'
import { REST_SERVER_URL } from 'src/services/constants'
import { vi, expect, test, beforeEach, describe, afterEach, type MockInstance, MockedFunction } from 'vitest'
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})
const { useNavigate: useNavigateRaw } = await import('react-router-dom')
// Es bastante tricky pero así tipamos el useNavigate que queremos mockear
const useNavigate = useNavigateRaw as unknown as MockedFunction<() => ReturnType<typeof vi.fn>>
const { MemoryRouter } = await import('react-router-dom')

describe('tests de asignar tarea', () => {
  const idTareaAsignada = 159
  let spyGetAxios: MockInstance<typeof axios['get']>
  let spyPutAxios: MockInstance<typeof axios['put']>
  let mockNavigate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockNavigate = vi.fn()
    useNavigate.mockReturnValue(mockNavigate)
    vi.mock('axios')
    spyGetAxios = vi.spyOn(axios, 'get')
    spyPutAxios = vi.spyOn(axios, 'put')

    spyGetAxios
      .mockResolvedValueOnce({
        data: [ 
          {
            id: 1,
            nombre: 'Margarito Tereré',
          },
          {
            id: 2,
            nombre: 'Misia Pataca',
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          id: idTareaAsignada,
          descripcion: 'Ejemplo',
          iteracion: '',
          asignadoA: 'Margarito Tereré',
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
      expect(asignatario).toBe('Margarito Tereré')
    })
  })

  test('al cambiar el asignatario se asigna a una nueva persona', async () => {
    render(
      <MemoryRouter initialEntries={[`/asignarTarea/${idTareaAsignada}`]} initialIndex={0}>
        <TareasRoutes/>
      </MemoryRouter>
    )
    await waitFor(() => {
      const asignatario = (screen.getByTestId('asignatario') as HTMLSelectElement).value
      expect(asignatario).toBe('Margarito Tereré')
    })
    const selectAsignatario = screen.getByTestId('asignatario') as HTMLSelectElement
    userEvent.selectOptions(selectAsignatario, 'Misia Pataca')
    await waitFor(() => {
      expect(selectAsignatario.value).toBe('Misia Pataca')
    })
  })

  test('al cambiar la descripción se actualiza la tarea', async () => {
    render(
      <MemoryRouter initialEntries={[`/asignarTarea/${idTareaAsignada}`]} initialIndex={0}>
        <TareasRoutes/>
      </MemoryRouter>
    )
    await waitFor(() => {
      const textDescripcion = (screen.getByTestId('descripcion') as HTMLInputElement).value
      expect(textDescripcion).toBe('Ejemplo')
    })
    const inputDescripcion = screen.getByTestId('descripcion') as HTMLInputElement
    userEvent.type(inputDescripcion, ' 2')
    await waitFor(() => {
      expect(inputDescripcion.value).toBe('Ejemplo 2')
    })
  })

  test('al aceptar los cambios se actualiza la tarea', async () => {
    render(
      <MemoryRouter initialEntries={[`/asignarTarea/${idTareaAsignada}`]} initialIndex={0}>
        <TareasRoutes/>
      </MemoryRouter>
    )
    const selectAsignatario = screen.getByTestId('asignatario') as HTMLSelectElement
    await waitFor(() => {
      expect(selectAsignatario.value).toBe('Margarito Tereré')
    })
    userEvent.selectOptions(selectAsignatario, 'Misia Pataca')
    await waitFor(() => {
      expect(selectAsignatario.value).toBe('Misia Pataca')
    })
    const buttonAceptar = screen.getByTestId('aceptar')
    userEvent.click(buttonAceptar)
    await waitFor(() => {
      expect(spyPutAxios.mock.calls.length).toBe(1)
      expect(spyPutAxios.mock.calls[0]).to.deep.equal([
        'http://localhost:9000/tareas/159', {
          asignadoA: 'Misia Pataca',
          asignatario: null,
          descripcion: 'Ejemplo',
          fecha: '10/10/2015',
          id: 159,
          iteracion: '',
          porcentajeCumplimiento: 0,
        },
      ])
    })
  })

  test('al cancelar los cambios se vuelve a la lista de tareas', async () => {
    render(
      <MemoryRouter initialEntries={[`/asignarTarea/${idTareaAsignada}`]} initialIndex={0}>
        <TareasRoutes/>
      </MemoryRouter>
    )
    const buttonCancelar = screen.getByTestId('cancelar')
    userEvent.click(buttonCancelar)
    await waitFor(() => {
      expect(spyPutAxios.mock.calls.length).toBe(0)
      expect(mockNavigate).toHaveBeenCalledWith('/')
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })
  })
})