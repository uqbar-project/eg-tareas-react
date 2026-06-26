import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockTareaJSON, mockUsuarios } from '@/test-utils/mockData'

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
      put: vi.fn(),
    },
    AxiosError: vi.fn(),
  }
})

import axios from 'axios'

import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  type MockedFunction,
  type MockInstance,
  test,
  vi,
} from 'vitest'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})
const { useNavigate: useNavigateRaw } = await import('react-router-dom')
const useNavigate = useNavigateRaw as unknown as MockedFunction<
  () => ReturnType<typeof vi.fn>
>
const { MemoryRouter } = await import('react-router-dom')

import { PAGINATION_CONFIG } from '@/services/constants'

function runTests() {
  const idTareaAsignada = 159
  let spyGetAxios: MockInstance<(typeof axios)['get']>
  let spyPutAxios: MockInstance<(typeof axios)['put']>
  let mockNavigate: ReturnType<typeof vi.fn>
  let TareasRoutes: React.ComponentType

  beforeEach(async () => {
    vi.clearAllMocks()

    mockNavigate = vi.fn()
    useNavigate.mockReturnValue(mockNavigate)

    spyGetAxios = vi.spyOn(axios, 'get')
    spyPutAxios = vi.spyOn(axios, 'put')

    spyGetAxios.mockImplementation((url: string) => {
      if (url.includes('/usuarios')) {
        return Promise.resolve({ data: mockUsuarios })
      }
      if (url.includes('/tareas/')) {
        return Promise.resolve({ data: mockTareaJSON })
      }
      if (url.includes('/tareas')) {
        return Promise.resolve({
          data: PAGINATION_CONFIG.enabled
            ? { hasMore: false, data: [mockTareaJSON] }
            : [mockTareaJSON],
        })
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`))
    })

    const routesModule = await import('@/routes')
    TareasRoutes = routesModule.TareasRoutes
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('al inicio muestra la información de la tarea', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/asignarTarea/${idTareaAsignada}`]}
        initialIndex={0}
      >
        <TareasRoutes />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(spyGetAxios.mock.calls[0]).to.contain(
        'http://localhost:9000/usuarios'
      )
      expect(spyGetAxios.mock.calls[2]).to.contain(
        `http://localhost:9000/tareas/${idTareaAsignada}`
      )
    })

    await waitFor(() => {
      const textDescripcion = (
        screen.getByTestId('descripcion') as HTMLInputElement
      ).value
      expect(textDescripcion).toBe('Ejemplo')
    })
    await waitFor(() => {
      const asignatario = (
        screen.getByTestId('asignatario') as HTMLSelectElement
      ).value
      expect(asignatario).toBe('Margarito Tereré')
    })
  })

  test('al cambiar el asignatario se asigna a una nueva persona', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/asignarTarea/${idTareaAsignada}`]}
        initialIndex={0}
      >
        <TareasRoutes />
      </MemoryRouter>
    )
    await waitFor(() => {
      const asignatario = (
        screen.getByTestId('asignatario') as HTMLSelectElement
      ).value
      expect(asignatario).toBe('Margarito Tereré')
    })
    const selectAsignatario = screen.getByTestId(
      'asignatario'
    ) as HTMLSelectElement
    userEvent.selectOptions(selectAsignatario, 'Misia Pataca')
    await waitFor(() => {
      expect(selectAsignatario.value).toBe('Misia Pataca')
    })
  })

  test('al cambiar la descripción se actualiza la tarea', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/asignarTarea/${idTareaAsignada}`]}
        initialIndex={0}
      >
        <TareasRoutes />
      </MemoryRouter>
    )
    await waitFor(() => {
      const textDescripcion = (
        screen.getByTestId('descripcion') as HTMLInputElement
      ).value
      expect(textDescripcion).toBe('Ejemplo')
    })
    const inputDescripcion = screen.getByTestId(
      'descripcion'
    ) as HTMLInputElement
    userEvent.type(inputDescripcion, ' 2')
    await waitFor(() => {
      expect(inputDescripcion.value).toBe('Ejemplo 2')
    })
  })

  test('al aceptar los cambios se actualiza la tarea', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/asignarTarea/${idTareaAsignada}`]}
        initialIndex={0}
      >
        <TareasRoutes />
      </MemoryRouter>
    )
    const selectAsignatario = screen.getByTestId(
      'asignatario'
    ) as HTMLSelectElement
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
        'http://localhost:9000/tareas/159',
        {
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
      <MemoryRouter
        initialEntries={[`/asignarTarea/${idTareaAsignada}`]}
        initialIndex={0}
      >
        <TareasRoutes />
      </MemoryRouter>
    )
    const buttonCancelar = screen.getByTestId('cancelar')
    userEvent.click(buttonCancelar)
    await waitFor(() => {
      expect(spyPutAxios.mock.calls.length).toBe(0)
      expect(mockNavigate).toHaveBeenCalledWith(-1)
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })
  })
}

describe('tests de asignar tarea con paginador activado', () => {
  beforeAll(() => {
    PAGINATION_CONFIG.enabled = true
  })

  runTests()
})

describe('tests de asignar tarea con paginador desactivado', () => {
  beforeAll(() => {
    PAGINATION_CONFIG.enabled = false
  })

  runTests()
})
