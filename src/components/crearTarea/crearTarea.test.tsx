import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockUsuarios } from '@/testUtils/mockData'

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
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

const { CrearTareaComponent } = await import('./crearTarea')

function runTests() {
  let spyGetAxios: MockInstance<(typeof axios)['get']>
  let spyPostAxios: MockInstance<(typeof axios)['post']>
  let mockNavigate: ReturnType<typeof vi.fn>
  let PaginadorLayout: React.ComponentType

  beforeEach(async () => {
    vi.clearAllMocks()

    mockNavigate = vi.fn()
    useNavigate.mockReturnValue(mockNavigate)

    spyGetAxios = vi.spyOn(axios, 'get')
    spyPostAxios = vi.spyOn(axios, 'post')

    spyGetAxios.mockImplementation((url: string) => {
      if (url.includes('/usuarios')) {
        return Promise.resolve({ data: mockUsuarios })
      }
      if (url.includes('/tareas')) {
        return Promise.resolve({
          data: PAGINATION_CONFIG.enabled ? { hasMore: false, data: [] } : [],
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

  test('muestra el formulario de creacion', async () => {
    render(
      <MemoryRouter initialEntries={['/crearTarea']} initialIndex={0}>
        <Routes>
          <Route path="/" element={<PaginadorLayout />}>
            <Route path="/crearTarea" element={<CrearTareaComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('descripcion')).toBeTruthy()
      expect(screen.getByTestId('iteracion')).toBeTruthy()
      expect(screen.getByTestId('fecha')).toBeTruthy()
      expect(screen.getByTestId('asignatario')).toBeTruthy()
    })
  })

  test('al crear la tarea se llama al servicio POST y se vuelve atras', async () => {
    spyPostAxios.mockResolvedValue({ data: { id: 999 } })

    render(
      <MemoryRouter initialEntries={['/crearTarea']} initialIndex={0}>
        <Routes>
          <Route path="/" element={<PaginadorLayout />}>
            <Route path="/crearTarea" element={<CrearTareaComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('descripcion')).toBeTruthy()
    })

    const inputDescripcion = screen.getByTestId(
      'descripcion'
    ) as HTMLInputElement
    await userEvent.type(inputDescripcion, 'Nueva tarea')

    const selectAsignatario = screen.getByTestId(
      'asignatario'
    ) as HTMLSelectElement
    await userEvent.selectOptions(selectAsignatario, 'Misia Pataca')

    await userEvent.click(screen.getByTestId('crear'))

    await waitFor(() => {
      expect(spyPostAxios.mock.calls.length).toBe(1)
      expect(spyPostAxios.mock.calls[0][0]).toBe('http://localhost:9000/tareas')
    })
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  test('al fallar la creacion se muestra toast de error', async () => {
    spyPostAxios.mockRejectedValue(new Error('Error al crear'))

    render(
      <MemoryRouter initialEntries={['/crearTarea']} initialIndex={0}>
        <Routes>
          <Route path="/" element={<PaginadorLayout />}>
            <Route path="/crearTarea" element={<CrearTareaComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('crear')).toBeTruthy()
    })

    await userEvent.click(screen.getByTestId('crear'))

    await waitFor(() => {
      expect(screen.getByText('Error al crear')).toBeTruthy()
    })
  })

  test('al cancelar se vuelve atras', async () => {
    render(
      <MemoryRouter initialEntries={['/crearTarea']} initialIndex={0}>
        <Routes>
          <Route path="/" element={<PaginadorLayout />}>
            <Route path="/crearTarea" element={<CrearTareaComponent />} />
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

describe('tests de crear tarea con paginador activado', () => {
  beforeAll(() => {
    PAGINATION_CONFIG.enabled = true
  })

  runTests()
})

describe('tests de crear tarea con paginador desactivado', () => {
  beforeAll(() => {
    PAGINATION_CONFIG.enabled = false
  })

  runTests()
})
