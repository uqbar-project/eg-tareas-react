import type { CSSProperties } from 'react'
import { describe, expect, test, vi } from 'vitest'

type Modulo = typeof import('./tonoAvatar')

const cargar = async (): Promise<Modulo> => {
  vi.resetModules()
  return await import('./tonoAvatar')
}

const tonoDe = (modulo: Modulo, nombre: string) =>
  (modulo.tonoDeCss(nombre) as Record<string, number>)['--tono']

const tonosDe = (modulo: Modulo, nombres: string[]) =>
  nombres.map((nombre) => tonoDe(modulo, nombre))

describe('inicialesDe', () => {
  test('toma la primera y la última palabra', async () => {
    const { inicialesDe } = await cargar()
    expect(inicialesDe('Eliana Mendia')).toBe('EM')
  })

  test('con una sola palabra toma las dos primeras letras', async () => {
    const { inicialesDe } = await cargar()
    expect(inicialesDe('Ana')).toBe('AN')
    expect(inicialesDe('Cher')).toBe('CH')
  })

  test('sin nombre muestra ?', async () => {
    const { inicialesDe } = await cargar()
    expect(inicialesDe()).toBe('?')
    expect(inicialesDe('')).toBe('?')
    expect(inicialesDe('   ')).toBe('?')
  })
})

describe('tonoDeCss', () => {
  test('devuelve el matiz como variable CSS', async () => {
    const modulo = await cargar()
    const tono = tonoDe(modulo, 'Eliana Mendia')
    expect(typeof tono).toBe('number')
    expect(tono).toBeGreaterThanOrEqual(0)
    expect(tono).toBeLessThan(360)
  })

  test('la primera decena de personas recibe diez tonos distintos', async () => {
    const modulo = await cargar()
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
    expect(new Set(tonosDe(modulo, nombres)).size).toBe(10)
  })

  test('pasada la decena reparte parejo en vez de repetir', async () => {
    const modulo = await cargar()
    const nombres = Array.from(
      { length: 33 },
      (_, indice) => `Persona Numero ${indice}`
    )

    const cuenta = new Map<number, number>()
    for (const tono of tonosDe(modulo, nombres)) {
      cuenta.set(tono, (cuenta.get(tono) ?? 0) + 1)
    }

    const totales = [...cuenta.values()]
    expect(cuenta.size).toBe(10)
    expect(Math.max(...totales) - Math.min(...totales)).toBeLessThanOrEqual(1)
  })

  test('la misma persona conserva su tono aunque se mezclen otras', async () => {
    const modulo = await cargar()
    const antes = tonoDe(modulo, 'Kiana Ruiz')

    tonosDe(
      modulo,
      Array.from({ length: 12 }, (_, indice) => `Otra Persona ${indice}`)
    )

    expect(tonoDe(modulo, 'Kiana Ruiz')).toBe(antes)
  })

  test('nadie compite con el color de la marca', async () => {
    const modulo = await cargar()
    const hues = tonosDe(
      modulo,
      Array.from({ length: 60 }, (_, indice) => `Persona ${indice}`)
    )

    expect(hues.filter((hue) => hue >= 150 && hue <= 205)).toEqual([])
  })

  test('devuelve un valor usable como CSSProperties', async () => {
    const modulo = await cargar()
    const estilo: CSSProperties = modulo.tonoDeCss('Eliana Mendia')
    expect(estilo).toHaveProperty('--tono')
  })
})
