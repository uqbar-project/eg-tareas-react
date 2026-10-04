import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { Asignatario } from './asignatario'

const renderizar = (nombre?: string, id = 159) =>
  render(<Asignatario nombre={nombre} id={id} />)

const avatar = (id = 159) => screen.getByTestId(`avatar_${id}`)
const textoParaLectores = (id = 159) => screen.getByTestId(`asignatario_${id}`)

describe('avatar del asignatario', () => {
  test('con nombre muestra las iniciales de la primera y la última palabra', () => {
    renderizar('Denis Stracqualursi')
    expect(avatar().textContent).toBe('DS')
  })

  test('con una sola palabra toma las dos primeras letras', () => {
    renderizar('Ana')
    expect(avatar().textContent).toBe('AN')
  })

  test('con espacios de sobra igual toma bien las iniciales', () => {
    renderizar('  Eliana   Mendia  ')
    expect(avatar().textContent).toBe('EM')
  })
})

describe('avatar sin asignar', () => {
  test('sin nombre muestra un ?', () => {
    renderizar(undefined)
    expect(avatar().textContent).toBe('?')
  })

  test('con nombre vacío o solo espacios también muestra un ?', () => {
    renderizar('   ')
    expect(avatar().textContent).toBe('?')
  })

  test('lleva la clase que lo pinta en gris', () => {
    renderizar(undefined)
    expect(avatar().className).toContain('avatarSinAsignar')
  })

  test('no lleva la clase cuando sí hay asignatario', () => {
    renderizar('Eliana Mendia')
    expect(avatar().className).not.toContain('avatarSinAsignar')
  })

  test('no recibe tono porque no hay a quién asignárselo', () => {
    renderizar(undefined)
    expect(avatar().style.getPropertyValue('--tono')).toBe('')
  })
})

describe('tono pastel', () => {
  test('con nombre aplica el tono como variable css', () => {
    renderizar('Eliana Mendia')
    expect(avatar().style.getPropertyValue('--tono')).toMatch(/^\d+$/)
  })

  test('la misma persona conserva su tono aunque este en varias filas', () => {
    render(
      <>
        <Asignatario nombre="Eliana Mendia" id={1} />
        <Asignatario nombre="Otra Persona" id={2} />
        <Asignatario nombre="Eliana Mendia" id={3} />
      </>
    )

    expect(avatar(3).style.getPropertyValue('--tono')).toBe(
      avatar(1).style.getPropertyValue('--tono')
    )
    expect(avatar(3).style.getPropertyValue('--tono')).not.toBe(
      avatar(2).style.getPropertyValue('--tono')
    )
  })

  test('distintas personas reciben tonos distintos', () => {
    const nombres = ['Eliana Mendia', 'Denis Stracqualursi', 'Paula Paretto']
    render(
      nombres.map((nombre, indice) => (
        <Asignatario key={nombre} nombre={nombre} id={indice + 1} />
      ))
    )

    const tonos = nombres.map((_, indice) =>
      avatar(indice + 1).style.getPropertyValue('--tono')
    )
    expect(new Set(tonos).size).toBe(nombres.length)
  })
})

describe('accesibilidad', () => {
  test('el title muestra el nombre completo', () => {
    renderizar('Eliana Mendia')
    expect(avatar().getAttribute('title')).toBe('Eliana Mendia')
  })

  test('el title sin asignatario aclara que no hay nadie', () => {
    renderizar(undefined)
    expect(avatar().getAttribute('title')).toBe('Sin asignar')
  })

  test('el nombre completo queda disponible para lectores de pantalla', () => {
    renderizar('Eliana Mendia')
    expect(textoParaLectores().textContent).toBe('Eliana Mendia')
  })

  test('el lector de pantalla también recibe Sin asignar', () => {
    renderizar(undefined)
    expect(textoParaLectores().textContent).toBe('Sin asignar')
  })

  test('el avatar decorativo se oculta de la accesibilidad', () => {
    renderizar('Eliana Mendia')
    expect(avatar().getAttribute('aria-hidden')).toBe('true')
  })

  test('el texto para lectores de pantalla está oculto a la vista', () => {
    renderizar('Eliana Mendia')
    expect(textoParaLectores().className).toContain('srOnly')
  })
})
