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

  test('cada campo está asociado a su label', async () => {
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

    expect(screen.getByLabelText('Descripción')).toBe(
      screen.getByTestId('descripcion')
    )
    expect(screen.getByLabelText('Iteración')).toBe(
      screen.getByTestId('iteracion')
    )
    expect(screen.getByLabelText('Fecha')).toBe(screen.getByTestId('fecha'))
    expect(screen.getByLabelText('Asignatario')).toBe(
      screen.getByTestId('asignatario')
    )
  })

  test('los ids se generan, no son literales estáticos', async () => {
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

    const idDescripcion = screen.getByTestId('descripcion').getAttribute('id')
    expect(idDescripcion).toBeTruthy()
    expect(idDescripcion).not.toBe('descripcion')

    const idAsignatario = screen.getByTestId('asignatario').getAttribute('id')
    expect(idAsignatario).toBeTruthy()
    expect(idAsignatario).not.toBe(idDescripcion)
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

    const hoy = new Date()
    const fechaValida = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`

    await userEvent.type(screen.getByTestId('descripcion'), 'Nueva tarea')
    const fechaInput = screen.getByTestId('fecha') as HTMLInputElement
    await userEvent.clear(fechaInput)
    await userEvent.type(fechaInput, fechaValida)
    const selectAsignatario = screen.getByTestId(
      'asignatario'
    ) as HTMLSelectElement
    await userEvent.selectOptions(selectAsignatario, 'Misia Pataca')

    await userEvent.click(screen.getByTestId('crear'))

    await waitFor(() => {
      expect(screen.getByText('Error al crear')).toBeTruthy()
    })
  })

  test('muestra errores debajo de cada campo cuando la validación falla', async () => {
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

    const ayer = new Date()
    ayer.setDate(ayer.getDate() - 1)
    const fechaAyer = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, '0')}-${String(ayer.getDate()).padStart(2, '0')}`
    const fechaInput = screen.getByTestId('fecha') as HTMLInputElement
    await userEvent.clear(fechaInput)
    await userEvent.type(fechaInput, fechaAyer)

    await userEvent.click(screen.getByTestId('crear'))

    await waitFor(() => {
      expect(screen.getByTestId('error-descripcion')).toBeTruthy()
      expect(screen.getByTestId('error-descripcion').textContent).toBe(
        'La descripción es obligatoria'
      )
      expect(screen.getByTestId('error-fecha')).toBeTruthy()
      expect(screen.getByTestId('error-fecha').textContent).toBe(
        'La fecha debe ser mayor o igual a la fecha de hoy'
      )
    })

    expect(spyPostAxios.mock.calls.length).toBe(0)
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
