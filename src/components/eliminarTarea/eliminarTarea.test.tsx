import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockTareaJSON, mockUsuarios } from '@/testUtils/mockData'

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
      delete: vi.fn(),
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
const { MemoryRouter, Route, Routes } = await import('react-router-dom')

import { PAGINATION_CONFIG } from '@/services/constants'

const { EliminarTareaComponent } = await import('./eliminarTarea')

function runTests() {
  const idTarea = 159
  let spyGetAxios: MockInstance<(typeof axios)['get']>
  let spyDeleteAxios: MockInstance<(typeof axios)['delete']>
  let mockNavigate: ReturnType<typeof vi.fn>
  let PaginadorLayout: React.ComponentType

  beforeEach(async () => {
    vi.clearAllMocks()

    mockNavigate = vi.fn()
    useNavigate.mockReturnValue(mockNavigate)

    spyGetAxios = vi.spyOn(axios, 'get')
    spyDeleteAxios = vi.spyOn(axios, 'delete')

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
    PaginadorLayout = routesModule.PaginadorLayout
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('muestra la confirmacion con la descripcion de la tarea', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/eliminarTarea/${idTarea}`]}
        initialIndex={0}
      >
        <Routes>
          <Route path="/" element={<PaginadorLayout />}>
            <Route
              path="/eliminarTarea/:id"
              element={<EliminarTareaComponent />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Ejemplo/)).toBeTruthy()
    })
  })

  test('al eliminar la tarea se llama al servicio DELETE y se vuelve atras', async () => {
    spyDeleteAxios.mockResolvedValue({})

    render(
      <MemoryRouter
        initialEntries={[`/eliminarTarea/${idTarea}`]}
        initialIndex={0}
      >
        <Routes>
          <Route path="/" element={<PaginadorLayout />}>
            <Route
              path="/eliminarTarea/:id"
              element={<EliminarTareaComponent />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('eliminar')).toBeTruthy()
    })

    await userEvent.click(screen.getByTestId('eliminar'))

    await waitFor(() => {
      expect(spyDeleteAxios.mock.calls.length).toBe(1)
      expect(spyDeleteAxios.mock.calls[0][0]).toBe(
        `http://localhost:9000/tareas/${idTarea}`
      )
    })
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  test('al fallar la eliminacion se muestra toast de error', async () => {
    spyDeleteAxios.mockRejectedValue(new Error('Error al eliminar'))

    render(
      <MemoryRouter
        initialEntries={[`/eliminarTarea/${idTarea}`]}
        initialIndex={0}
      >
        <Routes>
          <Route path="/" element={<PaginadorLayout />}>
            <Route
              path="/eliminarTarea/:id"
              element={<EliminarTareaComponent />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('eliminar')).toBeTruthy()
    })

    await userEvent.click(screen.getByTestId('eliminar'))

    await waitFor(() => {
      expect(screen.getByText('Error al eliminar')).toBeTruthy()
    })
  })

  test('al cancelar se vuelve atras', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/eliminarTarea/${idTarea}`]}
        initialIndex={0}
      >
        <Routes>
          <Route path="/" element={<PaginadorLayout />}>
            <Route
              path="/eliminarTarea/:id"
              element={<EliminarTareaComponent />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cancelar')).toBeTruthy()
    })

    await userEvent.click(screen.getByTestId('cancelar'))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
}

describe('tests de eliminar tarea con paginador activado', () => {
  beforeAll(() => {
    PAGINATION_CONFIG.enabled = true
  })

  runTests()
})

describe('tests de eliminar tarea con paginador desactivado', () => {
  beforeAll(() => {
    PAGINATION_CONFIG.enabled = false
  })

  runTests()
})
