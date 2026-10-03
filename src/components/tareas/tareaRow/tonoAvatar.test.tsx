import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import { crearTarea } from '@/testUtils/crearTarea'
import { TareaRow } from './tareaRow'

vi.mock('react-router-dom', async () => {
  const mockedRouter = await vi.importActual('react-router-dom')

  return {
    ...mockedRouter,
    useNavigate: () => vi.fn(),
  }
})

vi.mock('@/services/tareaService', () => ({
  tareaService: {
    actualizarTarea: vi.fn(() => Promise.resolve()),
  },
}))

let ultimoId = 0

const renderizarPersona = (nombre: string) => {
  ultimoId++
  render(
    <BrowserRouter>
      <TareaRow
        tarea={crearTarea(ultimoId, 'Tarea', 0, nombre)}
        actualizar={() => {}}
      />
    </BrowserRouter>
  )
  return screen
    .getByTestId(`avatar_${ultimoId}`)
    .style.getPropertyValue('--tono')
}

const renderizarPersonas = (nombres: string[]) =>
  nombres.map((nombre) => renderizarPersona(nombre))

describe('asignación de tono pastel', () => {
  test('diez personas distintas reciben diez tonos distintos', () => {
    const nombres = [
      'Ana Torres',
      'Bruno Díaz',
      'Carla Ruiz',
      'Diego Paz',
      'Eva Molina',
      'Fabián Sosa',
      'Gina Rey',
      'Hugo Lara',
      'Ivy Crescent',
      'Julián Vega',
    ]
    const tonos = renderizarPersonas(nombres)
    expect(new Set(tonos).size).toBe(10)
  })

  test('la misma persona conserva su tono aunque se mezclen otras', () => {
    const primera = renderizarPersonas(['Ana Torres'])
    renderizarPersonas([
      'Kiana Ruiz',
      'Lars Nunez',
      'Mia Fuentes',
      'Nico Braun',
      'Olga Peris',
      'Paz Roldan',
      'Quim Sola',
      'Rita Vidal',
      'Teo Yanes',
      'Uma Rios',
    ])
    renderizarPersonas(['Ana Torres'])
    expect(renderizarPersona('Ana Torres')).toBe(primera[0])
  })

  test('incluso después de muchas personas, otras diez no repiten tono', () => {
    const nombres = [
      'Vicente Paz',
      'Wanda Cruz',
      'Xime Neri',
      'Yago Rou',
      'Zoe Vidal',
      'Aida Lopez',
      'Beto Sastre',
      'Caro Mendez',
      'Dino Ponce',
      'Elsa Quiroga',
    ]
    const tonos = renderizarPersonas(nombres)
    // Al elegir siempre el tono menos usado, cualquier tanda de diez personas
    // nuevas recibe diez tonos distintos.
    expect(new Set(tonos).size).toBe(10)
  })
})
